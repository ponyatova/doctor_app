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

export async function upsertDoctorContacts(prevState: any, formData: FormData) {
  const supabase = await checkAdmin();

  const { data: doctor, error: doctorError } = await supabase
    .from("doctors")
    .select("id")
    .single();

  if (doctorError || !doctor) {
    return { error: "Врач не найден" };
  }

  const { error } = await supabase
    .from("doctor_contacts")
    .update({
      type: (formData.get("type") as string) || "",
      value: (formData.get("value") as string) || "",
      label: (formData.get("label") as string) || "",
    })
    .eq("id", formData.get("id") as string);

  if (error) return { error: error.message };

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

  const { error } = await supabase
    .from("doctor_addresses")
    .update({
      address: (formData.get("address") as string) || "",
      clinic: (formData.get("clinic") as string) || "",
      map_link: (formData.get("map_link") as string) || null,
    })
    .eq("id", formData.get("id") as string);

  if (error) return { error: error.message };

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

  const id = formData.get("id") as string;

  const { error } = await supabase
    .from("doctor_schedule")
    .update({
      day_of_week: Number(formData.get("day_of_week")),
      start_time: formData.get("start_time"),
      end_time: formData.get("end_time"),
    })
    .eq("id", id);

  if (error) return { error: error.message };
  revalidatePath("/admin/doctor?tab=schedule");
  // redirect("/admin/doctor?tab=schedule");

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

  const { error } = await supabase
    .from("doctor_education")
    .update({
      title: (formData.get("title") as string) || "",
      year: (formData.get("year") as string) || "",
      type: (formData.get("type") as string) || null,
      order_num:
        formData.get("order_num") && formData.get("order_num") !== ""
          ? Number(formData.get("order_num"))
          : null,
    })
    .eq("id", formData.get("id"));

  if (error) return { error: error.message };

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
