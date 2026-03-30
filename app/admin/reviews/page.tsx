import Tabs from "@/components/admin/DoctorTabs";
import { Review } from "@/lib/types";
import ReviewsTab from "./ReviewsTab";
import { getReviewsAdmin } from "@/lib/db";

export default async function ReviewsPage() {
  const reviews = await getReviewsAdmin();
  return (
    <div className="mt-[70px] space-y-6">
      <Tabs<Review[]>
        tab="reviews"
        tabs={[
          {
            key: "admin",
            label: "Вернуться к админке",
            component: () => null,
          },
          {
            key: "reviews",
            label: "Отзывы",
            component: () => <ReviewsTab reviews={reviews} />,
          },
        ]}
      />
    </div>
  );
}
