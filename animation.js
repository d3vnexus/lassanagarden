document.addEventListener("DOMContentLoaded", () => {
    const observer = new IntersectionObserver(
        (entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const el = entry.target;
                    el.classList.add("show");

                    // Handle staggered children
                    if (el.classList.contains("stagger")) {
                        const children = el.children;
                        [...children].forEach((child, i) => {
                            setTimeout(() => {
                                child.style.opacity = 1;
                                child.style.transform = "translateY(0)";
                            }, i * 200); // stagger delay
                        });
                    }

                    obs.unobserve(el); // run once
                }
            });
        },
        { threshold: 0.2 }
    );

    // Observe all .reveal elements
    document.querySelectorAll(".reveal").forEach(el => observer.observe(el));

    //count function
    // Synchronized count function
    function count(el) {
        let target = parseInt(el.getAttribute("data-target"));
        let duration = 2000; // Total animation duration in milliseconds (2 seconds)
        let increment = target / (duration / 16); // 16ms = ~60fps
        let cnum = 0;

        const upcount = setInterval(function () {
            cnum += increment;

            // Ensure we don't exceed the target
            if (cnum >= target) {
                el.textContent = target;
                clearInterval(upcount);
            } else {
                el.textContent = Math.floor(cnum);
            }
        }, 16); // ~60fps for smooth animation
    }

    // Alternative approach with easing effect
    function countWithEasing(el) {
        let target = parseInt(el.getAttribute("data-target"));
        let duration = 2000; // 2 seconds
        let start = null;
        let startValue = 0;

        function animate(timestamp) {
            if (!start) start = timestamp;
            let progress = timestamp - start;
            let percentage = Math.min(progress / duration, 1);

            // Easing function for smoother animation
            let easeOutQuart = 1 - Math.pow(1 - percentage, 4);
            let currentValue = Math.floor(startValue + (target - startValue) * easeOutQuart);

            el.textContent = currentValue;

            if (progress < duration) {
                requestAnimationFrame(animate);
            } else {
                el.textContent = target; // Ensure final value is exact
            }
        }

        requestAnimationFrame(animate);
    }

    // Observe all counters
    const observer1 = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                // Use either count() or countWithEasing() - both work the same duration
                countWithEasing(entry.target); // Recommended for smoother animation
                observer1.unobserve(entry.target); // run once per element
            }
        });
    });

    document.querySelectorAll(".counter").forEach((el) => {
        observer1.observe(el);
    });

    // Simple version if you prefer the original approach
    function countSimple(el) {
        let target = parseInt(el.getAttribute("data-target"));
        let duration = 2000; // Fixed duration for all counters
        let steps = 100; // Number of steps in the animation
        let increment = target / steps;
        let stepDuration = duration / steps;
        let cnum = 0;
        let currentStep = 0;

        const upcount = setInterval(function () {
            currentStep++;
            cnum = Math.floor((target / steps) * currentStep);

            if (currentStep >= steps) {
                el.textContent = target;
                clearInterval(upcount);
            } else {
                el.textContent = cnum;
            }
        }, stepDuration);
    }

    //typing
    // RECOMMENDED: Simple and reliable typing effect
function typeWriter(element, speed) {
    const originalHTML = element.innerHTML;
    const fullText = element.textContent;
    
    let charIndex = 0;
    element.innerHTML = '';
    
    function type() {
        if (charIndex < fullText.length) {
            // Create temporary element with original HTML
            const temp = document.createElement('div');
            temp.innerHTML = originalHTML;
            
            // Get the partial text we want to show
            const partialText = fullText.substring(0, charIndex + 1);
            
            // Replace text content while preserving HTML structure
            replaceTextInHTML(temp, partialText);
            
            // Update the main element
            element.innerHTML = temp.innerHTML;
            
            charIndex++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// Helper function to replace text content in HTML elements
function replaceTextInHTML(element, newText) {
    let textIndex = 0;
    
    function updateTextNodes(node) {
        if (node.nodeType === Node.TEXT_NODE) {
            const originalLength = node.textContent.length;
            const replacement = newText.substring(textIndex, textIndex + originalLength);
            node.textContent = replacement;
            textIndex += originalLength;
        } else {
            for (let child of Array.from(node.childNodes)) {
                updateTextNodes(child);
            }
        }
    }
    
    updateTextNodes(element);
}

// Initialize
window.addEventListener('load', function() {
    setTimeout(() => {
        const heroTitle = document.querySelector('.hero-title');
        if (heroTitle) {
            typeWriter(heroTitle, 100);
        }
    }, 1000);
});
});
