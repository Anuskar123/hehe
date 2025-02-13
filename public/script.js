document.addEventListener('DOMContentLoaded', function() {
    // Smooth scrolling for navigation links
    document.querySelectorAll('nav ul li button').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('data-target'));
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

    // Load reviews
    fetch('/reviews')
        .then(response => response.json())
        .then(reviews => {
            const reviewsList = document.getElementById('reviews-list');
            reviews.forEach((review, index) => {
                const reviewItem = document.createElement('div');
                reviewItem.classList.add('review-item', 'p-4', 'border', 'border-gray-300', 'rounded', 'mb-4');
                reviewItem.innerHTML = `
                    <img src="images/default-avatar.png" alt="User Avatar">
                    <div class="review-content">
                        <strong>${review.name}</strong> <span class="stars">${'★'.repeat(review.rating)}</span>
                        <p>${review.review}</p>
                        <small>${review.date}</small>
                    </div>
                    <button class="delete-review" data-index="${index}" data-email="${review.email}">Delete</button>
                `;
                reviewsList.appendChild(reviewItem);
            });
            document.querySelectorAll('.delete-review').forEach(button => {
                button.addEventListener('click', function() {
                    const index = this.getAttribute('data-index');
                    const email = prompt('Please enter your email to delete this review:');
                    fetch('/delete-review', {
                        method: 'DELETE',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ index, email })
                    }).then(response => {
                        if (response.ok) {
                            this.parentElement.remove();
                        } else {
                            alert('You can only delete your own reviews.');
                        }
                    });
                });
            });
        });

    // Handle review form submission
    document.getElementById('review-form').addEventListener('submit', function(event) {
        event.preventDefault();
        const name = document.getElementById('name')?.value;
        const rating = document.querySelector('input[name="rating"]:checked')?.value;
        const review = document.getElementById('review')?.value;
        const email = prompt('Please enter your email to submit this review:');

        if (name && rating && review && email) {
            fetch('/submit-review', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name, rating, review, email })
            }).then(() => {
                const date = new Date().toLocaleString();
                const reviewItem = document.createElement('div');
                reviewItem.classList.add('review-item', 'p-4', 'border', 'border-gray-300', 'rounded', 'mb-4');
                reviewItem.innerHTML = `
                    <img src="images/default-avatar.png" alt="User Avatar">
                    <div class="review-content">
                        <strong>${name}</strong> <span class="stars">${'★'.repeat(rating)}</span>
                        <p>${review}</p>
                        <small>${date}</small>
                    </div>
                    <button class="delete-review" data-index="${index}" data-email="${email}">Delete</button>
                `;
                document.getElementById('reviews-list').appendChild(reviewItem);
                document.getElementById('review-form').reset();
            });
        } else {
            alert('Please fill out all fields.');
        }
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
