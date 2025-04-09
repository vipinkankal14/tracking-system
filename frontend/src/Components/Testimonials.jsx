import { Box, Container, Typography } from "@mui/material";

const testimonials = [
  {
    id: 1,
    name: "James Wilson",
    role: "Business Executive",
    image: "/images/testimonial-1.jpg",
    rating: 5,
    text: "The service was impeccable. I rented a Rolls-Royce for a business event and it made quite the impression. The car was in pristine condition and the booking process was seamless.",
  },
  {
    id: 2,
    name: "Sophia Martinez",
    role: "Wedding Planner",
    image: "/images/testimonial-2.jpg",
    rating: 5,
    text: "We've used Carent for multiple wedding events. Their luxury vehicles add that special touch to the big day, and their reliability is unmatched. Highly recommended!",
  },
  {
    id: 3,
    name: "Michael Chen",
    role: "Travel Enthusiast",
    image: "/images/testimonial-3.jpg",
    rating: 4,
    text: "Rented a Ferrari for a weekend getaway and it was an unforgettable experience. The car was amazing and the customer service was top-notch. Will definitely rent again.",
  },
];

function Testimonials() {
  return (
    <Container maxWidth="xl">
      <Box
        textAlign="center"
        mb={6}
        sx={{
          background: "linear-gradient(90deg, #667eea 0%, #764ba2 100%)",
          padding: "40px 20px",
          borderRadius: "6px",
          color: "white",
          boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Typography
          variant="h3"
          component="h1"
          gutterBottom
          sx={{
            fontWeight: "bold",
            textShadow: "2px 2px 4px rgba(0,0,0,0.2)",
          }}
        >
          What Our Clients Say
        </Typography>
        <Typography
          variant="subtitle1"
          sx={{
            maxWidth: "800px",
            margin: "0 auto",
            opacity: 0.9,
          }}
        >
          <p>
            Hear from our satisfied customers about their luxury rental
            experience
          </p>
        </Typography>
      </Box>

      <Container maxWidth="xl">
        <div className="testimonials-grid">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="testimonial-card">
              <div className="rating">
                {[...Array(5)].map((_, i) => (
                  <i
                    key={i}
                    className={`fas fa-star ${
                      i < testimonial.rating ? "filled" : ""
                    }`}
                  ></i>
                ))}
              </div>
              <p className="testimonial-text">"{testimonial.text}"</p>
              <div className="testimonial-author">
                <div className="author-image">
                  <img
                    src={testimonial.image || "/placeholder.svg"}
                    alt={testimonial.name}
                  />
                </div>
                <div className="author-info">
                  <h4>{testimonial.name}</h4>
                  <p>{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Container>
      <br />
      <br />
    </Container>
  );
}

export default Testimonials;
