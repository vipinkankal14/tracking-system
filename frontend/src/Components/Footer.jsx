import { Link as RouterLink } from "react-router-dom"
import "../styles/footer.scss"

const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <>
      
      <footer className="modern-footer pt-5">
        <div className="container footer-content">
            <div className="row g-4 mb-5">
           
                <div className="col-lg-4 col-md-6">
                    <a href="#" className="footer-logo d-block mb-4">
                        YourBrand<span className="text-primary">.</span>
                    </a>
                    <p className="text-muted mb-4">Empowering businesses with innovative digital solutions. We create
                        meaningful experiences that drive success.</p>
                    <ul className="contact-info mb-4">
                        <li>
                            <i className="fas fa-map-marker-alt"></i>
                            <span>123 Business Avenue, Suite 100<br/>New York, NY 10001</span>
                        </li>
                        <li>
                            <i className="fas fa-phone"></i>
                            <span>+1 (555) 123-4567</span>
                        </li>
                        <li>
                            <i className="fas fa-envelope"></i>
                            <span>contact@yourbrand.com</span>
                        </li>
                    </ul>
                </div>

           
                <div className="col-lg-4 col-md-6">
                    <h3 className="footer-title">Quick Links</h3>
                    <ul className="quick-links">
                        <li><a href="/">Home</a></li>
                        <li><a href="#">About Company</a></li>
                        <li><a href="#">Latest Projects</a></li>
                        <li><a href="#">Recent News</a></li>
                        <li><a href="#">Customer Support</a></li>
                        <li><a href="#">Contact Details</a></li>
                        <li><a href="#">Privacy Policy</a></li>
                        <li><a href="/Services">Service</a></li>
                    </ul>
                </div>

                 <div className="col-lg-4 col-md-12">
                    <h3 className="footer-title">Stay Connected</h3>
                    <p className="text-muted mb-4">Subscribe to our newsletter and stay updated with the latest news and
                        insights.</p>
                    <form className="mb-4">
                        <div className="mb-3">
                            <input type="email" className="form-control newsletter-input" placeholder="Your email address"/>
                        </div>
                        <button type="submit" className="btn btn-subscribe text-white w-100">Subscribe Now</button>
                    </form>
                    <div className="social-links">
                        <a href="#" className="social-icon"><i className="fab fa-facebook-f"></i></a>
                        <a href="#" className="social-icon"><i className="fab fa-twitter"></i></a>
                        <a href="#" className="social-icon"><i className="fab fa-instagram"></i></a>
                        <a href="#" className="social-icon"><i className="fab fa-linkedin-in"></i></a>
                        <a href="#" className="social-icon"><i className="fab fa-youtube"></i></a>
                    </div>
                </div>
            </div>
        </div>

         <div className="footer-bottom">
            <div className="container">
                <div className="row py-4">
                    <div className="col-md-6 text-center text-md-start">
                        <p>&copy; 2024 YourBrand. All rights reserved.</p>
                    </div>
                    <div className="col-md-6 text-center text-md-end">
                        <p>Made with <i className="fas fa-heart text-danger"></i> by <a href="#">YourBrand</a></p>
                    </div>
                </div>
            </div>
        </div>
    </footer>
    </>
  )
}

export default Footer

