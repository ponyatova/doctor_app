"use server";
import { checkAdmin } from "@/lib/actions";
import { revalidatePath } from "next/cache";

export async function updateDoctor(prevState: any, formData: FormData) {
  const supabase = await checkAdmin();
  if (!formData) {
    return { error: "FormData отсутствует" };
  }

  const doctor = {
    name: formData.get("name") as string,
    experience: formData.get("experience") as string,
    phone: formData.get("phone") as string,
    is_active: formData.get("is_active") === "on",
  };
  if (!doctor.name) {
    return { error: "Пожалуйста, заполните имя" };
  } else if (!doctor.experience) {
    return { error: "Пожалуйста, заполните опыт" };
  } else if (!doctor.phone) {
    return { error: "Пожалуйста, заполните телефон" };
  }

  // предполагаем, что врач один — обновляем первую запись
  const { data: existing } = await supabase
    .from("doctors")
    .select("id")
    .limit(1)
    .single();

  if (!existing) throw new Error("Врач не найден");

  const { error } = await supabase
    .from("doctors")
    .update(doctor as never)
    .eq("id", existing.id);

  if (error) {
    return { error: error.message };
  }
  revalidatePath("/admin/doctor");
  return { success: true };
}

type ContactFormValue = {
  id?: string;
  type: string;
  value: string;
  label?: string;
};

export async function upsertDoctorContacts(prevState: any, formData: FormData) {
  const supabase = await checkAdmin();

  const { data: doctor, error: doctorError } = await supabase
    .from("doctors")
    .select("id")
    .single();

  if (doctorError || !doctor) {
    return { error: "Врач не найден" };
  }

  const contactsMap = new Map<number, ContactFormValue>();

  for (const [key, value] of formData.entries()) {
    const match = key.match(/contacts\[(\d+)]\[(\w+)]/);
    if (!match) continue;

    const index = Number(match[1]);
    const field = match[2] as keyof ContactFormValue;

    if (!contactsMap.has(index)) {
      contactsMap.set(index, {} as ContactFormValue);
    }

    const item = contactsMap.get(index)!;

    if (field === "id") {
      item.id = value as string;
    } else if (field === "type") {
      item.type = value as string;
    } else if (field === "value") {
      item.value = value as string;
    } else if (field === "label") {
      item.label = value as string;
    }
  }

  const contacts = Array.from(contactsMap.values());

  for (const c of contacts) {
    // UPDATE
    if (c.id) {
      const { error } = await supabase
        .from("doctor_contacts")
        .update({
          type: c.type,
          value: c.value,
          label: c.label ?? null,
        })
        .eq("id", c.id);

      if (error) return { error: error.message };
    }
  }

  revalidatePath("/admin/doctor?tab=contacts");

  return { success: true };
}

export async function deleteDoctorContact(id: string) {
  const supabase = await checkAdmin();

  const { error } = await supabase
    .from("doctor_contacts")
    .delete()
    .eq("id", id);

  if (error) return { error: error.message };

  revalidatePath("/admin/doctor?tab=contacts");

  return { success: true };
}

export async function addDoctorContact(prevState: any, formData: FormData) {
  const supabase = await checkAdmin();
  if (!formData) {
    return { error: "FormData отсутствует" };
  }

  const contact = {
    type: formData.get("type") as string,
    value: formData.get("value") as string,
    label: formData.get("label") as string,
  };

  if (!contact.type) {
    return { error: "Пожалуйста, выберите тип контакта" };
  } else if (!contact.value) {
    return { error: "Пожалуйста, заполните значение контакта" };
  } else if (!contact.label) {
    return { error: "Пожалуйста, заполните метку контакта" };
  }

  const { data: doctor, error: doctorError } = await supabase
    .from("doctors")
    .select("id")
    .single();

  if (doctorError || !doctor) {
    return { error: "Врач не найден" };
  }

  const { error } = await supabase.from("doctor_contacts").insert({
    doctor_id: doctor.id,
    type: contact.type,
    value: contact.value,
    label: contact.label,
  });

  if (error) return { error: error.message };

  revalidatePath("/admin/doctor?tab=contacts");

  return { success: true };
}

export async function addDoctorAddress(prevState: any, formData: FormData) {
  const supabase = await checkAdmin();

  if (!formData) {
    return { error: "FormData отсутствует" };
  }

  const address = {
    address: formData.get("address") as string,
    clinic: formData.get("clinic") as string,
    map_link: formData.get("map_link") as string,
  };

  if (!address.address) {
    return { error: "Введите адрес" };
  }

  if (!address.clinic) {
    return { error: "Введите клинику" };
  }

  const { data: doctor, error: doctorError } = await supabase
    .from("doctors")
    .select("id")
    .single();

  if (doctorError || !doctor) {
    return { error: "Врач не найден" };
  }

  const { error } = await supabase.from("doctor_addresses").insert({
    doctor_id: doctor.id,
    address: address.address,
    clinic: address.clinic,
    map_link: address.map_link || null,
  });

  if (error) return { error: error.message };

  revalidatePath("/admin/doctor?tab=addresses");

  return { success: true };
}

export async function upsertDoctorAddresses(
  prevState: any,
  formData: FormData,
) {
  const supabase = await checkAdmin();

  const { data: doctor, error: doctorError } = await supabase
    .from("doctors")
    .select("id")
    .single();

  if (doctorError || !doctor) {
    return { error: "Врач не найден" };
  }

  const addressesMap = new Map<number, any>();

  for (const [key, value] of formData.entries()) {
    const match = key.match(/addresses\[(\d+)]\[(\w+)]/);
    if (!match) continue;

    const index = Number(match[1]);
    const field = match[2];

    if (!addressesMap.has(index)) {
      addressesMap.set(index, {});
    }

    const item = addressesMap.get(index)!;
    item[field] = value;
  }

  const addresses = Array.from(addressesMap.values());

  for (const a of addresses) {
    if (a.id) {
      const { error } = await supabase
        .from("doctor_addresses")
        .update({
          address: a.address,
          clinic: a.clinic,
          map_link: a.map_link || null,
        })
        .eq("id", a.id);

      if (error) return { error: error.message };
    }
  }

  revalidatePath("/admin/doctor?tab=addresses");

  return { success: true };
}

export async function deleteDoctorAddress(id: string) {
  const supabase = await checkAdmin();

  const { error } = await supabase
    .from("doctor_addresses")
    .delete()
    .eq("id", id);

  if (error) return { error: error.message };

  revalidatePath("/admin/doctor?tab=addresses");

  return { success: true };
}

export async function addDoctorSchedule(prevState: any, formData: FormData) {
  const supabase = await checkAdmin();

  if (!formData) {
    return { error: "FormData отсутствует" };
  }

  const schedule = {
    day_of_week: Number(formData.get("day_of_week")),
    start_time: formData.get("start_time") as string,
    end_time: formData.get("end_time") as string,
  };

  if (!schedule.day_of_week) {
    return { error: "Укажите день недели" };
  }

  const { data: doctor, error: doctorError } = await supabase
    .from("doctors")
    .select("id")
    .single();

  if (doctorError || !doctor) {
    return { error: "Врач не найден" };
  }

  const { error } = await supabase.from("doctor_schedule").insert({
    doctor_id: doctor.id,
    day_of_week: schedule.day_of_week,
    start_time: schedule.start_time,
    end_time: schedule.end_time,
  });

  if (error) return { error: error.message };

  revalidatePath("/admin/doctor?tab=schedule");

  return { success: true };
}

export async function upsertDoctorSchedules(
  prevState: any,
  formData: FormData,
) {
  const supabase = await checkAdmin();

  const { data: doctor, error: doctorError } = await supabase
    .from("doctors")
    .select("id")
    .single();

  if (doctorError || !doctor) {
    return { error: "Врач не найден" };
  }

  const scheduleMap = new Map<number, any>();

  for (const [key, value] of formData.entries()) {
    const match = key.match(/schedule\[(\d+)]\[(\w+)]/);
    if (!match) continue;

    const index = Number(match[1]);
    const field = match[2];

    if (!scheduleMap.has(index)) {
      scheduleMap.set(index, {});
    }

    const item = scheduleMap.get(index)!;
    item[field] = value;
  }

  const schedules = Array.from(scheduleMap.values());

  for (const s of schedules) {
    if (s.id) {
      const { error } = await supabase
        .from("doctor_schedule")
        .update({
          day_of_week: Number(s.day_of_week),
          start_time: s.start_time,
          end_time: s.end_time,
        })
        .eq("id", s.id);

      if (error) return { error: error.message };
    }
  }

  revalidatePath("/admin/doctor?tab=schedule");

  return { success: true };
}

export async function deleteDoctorSchedule(id: string) {
  const supabase = await checkAdmin();

  const { error } = await supabase
    .from("doctor_schedule")
    .delete()
    .eq("id", id);

  if (error) return { error: error.message };

  revalidatePath("/admin/doctor?tab=schedule");

  return { success: true };
}

export async function addDoctorEducation(prevState: any, formData: FormData) {
  const supabase = await checkAdmin();

  if (!formData) {
    return { error: "FormData отсутствует" };
  }

  const education = {
    title: formData.get("title") as string,
    year: formData.get("year") as string,
    type: formData.get("type") as string,
    order_num: Number(formData.get("order_num")) || null,
  };

  if (!education.title) {
    return { error: "Введите название" };
  }

  if (!education.year) {
    return { error: "Введите год" };
  }

  const { data: doctor, error: doctorError } = await supabase
    .from("doctors")
    .select("id")
    .single();

  if (doctorError || !doctor) {
    return { error: "Врач не найден" };
  }

  const { error } = await supabase.from("doctor_education").insert({
    doctor_id: doctor.id,
    title: education.title,
    year: education.year,
    type: education.type || null,
    order_num: education.order_num,
  });

  if (error) return { error: error.message };

  revalidatePath("/admin/doctor?tab=education");

  return { success: true };
}

export async function upsertDoctorEducation(
  prevState: any,
  formData: FormData,
) {
  const supabase = await checkAdmin();

  const { data: doctor, error: doctorError } = await supabase
    .from("doctors")
    .select("id")
    .single();

  if (doctorError || !doctor) {
    return { error: "Врач не найден" };
  }

  const educationMap = new Map<number, any>();

  for (const [key, value] of formData.entries()) {
    const match = key.match(/education\[(\d+)]\[(\w+)]/);
    if (!match) continue;

    const index = Number(match[1]);
    const field = match[2];

    if (!educationMap.has(index)) {
      educationMap.set(index, {});
    }

    const item = educationMap.get(index)!;
    item[field] = value;
  }

  const educationList = Array.from(educationMap.values());

  for (const e of educationList) {
    if (e.id) {
      const { error } = await supabase
        .from("doctor_education")
        .update({
          title: e.title,
          year: e.year,
          type: e.type || null,
          order_num:
            e.order_num && e.order_num !== "" ? Number(e.order_num) : null,
        })
        .eq("id", e.id);

      if (error) return { error: error.message };
    }
  }

  revalidatePath("/admin/doctor?tab=education");

  return { success: true };
}

export async function deleteDoctorEducation(id: string) {
  const supabase = await checkAdmin();

  const { error } = await supabase
    .from("doctor_education")
    .delete()
    .eq("id", id);

  if (error) return { error: error.message };

  revalidatePath("/admin/doctor?tab=education");

  return { success: true };
}
