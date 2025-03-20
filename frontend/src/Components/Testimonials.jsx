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
]

function Testimonials() {
  return (
    <section className="testimonials-section">
      <div className="container">
        <div className="section-header text-center">
          <h2>What Our Clients Say</h2>
          <p>Hear from our satisfied customers about their luxury rental experience</p>
        </div>

        <div className="testimonials-grid">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="testimonial-card">
              <div className="rating">
                {[...Array(5)].map((_, i) => (
                  <i key={i} className={`fas fa-star ${i < testimonial.rating ? "filled" : ""}`}></i>
                ))}
              </div>
              <p className="testimonial-text">"{testimonial.text}"</p>
              <div className="testimonial-author">
                <div className="author-image">
                  <img src={testimonial.image || "/placeholder.svg"} alt={testimonial.name} />
                </div>
                <div className="author-info">
                  <h4>{testimonial.name}</h4>
                  <p>{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Testimonials

