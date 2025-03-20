document.addEventListener("DOMContentLoaded", function () {
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener("click", function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute("href")).scrollIntoView({
                behavior: "smooth"
            });
        });
    });

    // Sticky header effect
    let lastScrollTop = 0;
    const header = document.querySelector("header");
    window.addEventListener("scroll", function () {
        let scrollTop = window.scrollY;
        if (scrollTop > lastScrollTop) {
            header.style.top = "-80px";
        } else {
            header.style.top = "0";
        }
        lastScrollTop = scrollTop;
    });

    // Contact form validation
    const contactForm = document.querySelector(".contact-form");
    if (contactForm) {
        contactForm.addEventListener("submit", function (e) {
            e.preventDefault();
            const email = this.querySelector("input[name='email']").value.trim();
            const message = this.querySelector("textarea[name='message']").value.trim();
            
            if (!email || !message) {
                alert("Please fill in all fields.");
                return;
            }
            alert("Message sent successfully!");
            this.reset();
        });
    }

    // Fade-in animation on scroll
    const sections = document.querySelectorAll("section");
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
            }
        });
    }, { threshold: 0.2 });
    
    sections.forEach(section => observer.observe(section));
});
