import CarCategories from "../Car/CarCategories/CarCategories";
import SuggestedProducts from "../Car/SuggestedProducts";
import SuggestedProducts1530 from "../Car/SuggestedProducts1530";
import Testimonials from "../Components/Testimonials";
import DiscountBanner from "../DiscountBanner/DiscountBanner";

function HomePage() {
  return (
    <>
      <DiscountBanner />
      <CarCategories />
      <SuggestedProducts />
      <SuggestedProducts1530 />
      <Testimonials />
    </>
  );
}

export default HomePage;
