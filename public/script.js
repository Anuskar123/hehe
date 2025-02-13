document.addEventListener('DOMContentLoaded', function() {
    // Smooth scrolling for navigation links
    document.querySelectorAll('nav ul li a').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            document.querySelectorAll('.section').forEach(section => {
                if (section !== target) {
                    section.classList.remove('visible');
                    section.style.display = 'none';
                }
            });
            target.style.display = 'block';
            setTimeout(() => {
                target.classList.add('visible');
            }, 10);
        });
    });

    // Add visibility class to sections when they come into view
    const sections = document.querySelectorAll('.section');
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1
    });

    sections.forEach(section => {
        observer.observe(section);
    });

    // Interactive star rating
    document.querySelectorAll('.rating label').forEach(label => {
        label.addEventListener('mouseover', function() {
            const stars = this.parentNode.querySelectorAll('label');
            stars.forEach(star => star.style.color = '#ddd');
            this.style.color = '#ffcc00';
            let nextSibling = this.nextElementSibling;
            while (nextSibling) {
                nextSibling.style.color = '#ffcc00';
                nextSibling = nextSibling.nextElementSibling;
            }
        });
        label.addEventListener('mouseout', function() {
            const stars = this.parentNode.querySelectorAll('label');
            stars.forEach(star => star.style.color = '#ddd');
            const checkedStar = this.parentNode.querySelector('input:checked + label');
            if (checkedStar) {
                checkedStar.style.color = '#ffcc00';
                let nextSibling = checkedStar.nextElementSibling;
                while (nextSibling) {
                    nextSibling.style.color = '#ffcc00';
                    nextSibling = nextSibling.nextElementSibling;
                }
            }
        });
    });
});
