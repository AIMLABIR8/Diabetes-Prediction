const API_URL = 'http://localhost:8000';

const form = document.getElementById('predictionForm');
const predictBtn = document.getElementById('predictBtn');
const resetBtn = document.getElementById('resetBtn');
const errorDiv = document.getElementById('error');
const resultDiv = document.getElementById('result');

// Heart icon SVG
const heartIcon = `
    <svg xmlns="http://www.w3.org/2000/svg" width="72" height="72" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
    </svg>
`;

// Add input validation feedback
const inputs = document.querySelectorAll('input[type="number"]');
inputs.forEach(input => {
    input.addEventListener('input', () => {
        if (input.value) {
            input.style.borderColor = '#667eea';
        } else {
            input.style.borderColor = '#e5e7eb';
        }
    });
});

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Get form data
    const formData = {
        pregnancies: parseFloat(document.getElementById('pregnancies').value) || 0,
        glucose: parseFloat(document.getElementById('glucose').value) || 0,
        blood_pressure: parseFloat(document.getElementById('blood_pressure').value) || 0,
        skin_thickness: parseFloat(document.getElementById('skin_thickness').value) || 0,
        insulin: parseFloat(document.getElementById('insulin').value) || 0,
        bmi: parseFloat(document.getElementById('bmi').value) || 0,
        diabetes_pedigree_function: parseFloat(document.getElementById('diabetes_pedigree_function').value) || 0,
        age: parseFloat(document.getElementById('age').value) || 0
    };

    // Validate all fields are filled
    const hasEmptyFields = Object.values(formData).some(value => value === 0);
    
    // Show loading state
    predictBtn.disabled = true;
    predictBtn.innerHTML = `
        <svg class="spinner" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
        </svg>
        Analyzing...
    `;
    
    // Hide previous results
    errorDiv.classList.add('hidden');
    resultDiv.classList.add('hidden');

    try {
        const response = await fetch(`${API_URL}/predict`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        if (!response.ok) {
            throw new Error('Failed to get prediction');
        }

        const data = await response.json();
        displayResult(data);
    } catch (error) {
        errorDiv.textContent = 'Failed to get prediction. Please make sure the backend is running on http://localhost:8000';
        errorDiv.classList.remove('hidden');
        console.error('Error:', error);
    } finally {
        predictBtn.disabled = false;
        predictBtn.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
            </svg>
            Analyze & Predict
        `;
    }
});

resetBtn.addEventListener('click', () => {
    form.reset();
    errorDiv.classList.add('hidden');
    resultDiv.classList.add('hidden');
    
    // Reset input borders
    inputs.forEach(input => {
        input.style.borderColor = '#e5e7eb';
    });
});

function displayResult(data) {
    // Set result class based on prediction
    resultDiv.classList.remove('diabetic', 'not-diabetic');
    
    if (data.prediction === 1) {
        resultDiv.classList.add('diabetic');
    } else {
        resultDiv.classList.add('not-diabetic');
    }

    // Set icon
    document.querySelector('.result-icon').innerHTML = heartIcon;

    // Set title
    document.getElementById('resultTitle').textContent = data.result;

    // Set probability
    const probability = (data.probability * 100).toFixed(2);
    document.getElementById('probability').textContent = probability;

    // Set progress bar with animation delay
    setTimeout(() => {
        document.getElementById('progressBar').style.width = `${probability}%`;
    }, 100);

    // Set recommendation based on prediction
    const recommendationDiv = document.getElementById('recommendation');
    if (data.prediction === 1) {
        recommendationDiv.innerHTML = `
            <strong>Recommendations:</strong>
            <ul style="margin-top: 8px; margin-left: 20px;">
                <li>Consult a healthcare professional immediately</li>
                <li>Monitor blood glucose levels regularly</li>
                <li>Follow a balanced diet low in sugar</li>
                <li>Engage in regular physical activity</li>
                <li>Maintain a healthy weight</li>
            </ul>
        `;
    } else {
        recommendationDiv.innerHTML = `
            <strong>Recommendations:</strong>
            <ul style="margin-top: 8px; margin-left: 20px;">
                <li>Continue maintaining a healthy lifestyle</li>
                <li>Regular health check-ups are recommended</li>
                <li>Stay physically active</li>
                <li>Maintain a balanced diet</li>
                <li>Monitor your health metrics periodically</li>
            </ul>
        `;
    }

    // Show/hide warning
    const warning = document.getElementById('warning');
    if (data.prediction === 1) {
        warning.textContent = '⚠️ High risk detected. Please consult a healthcare professional immediately.';
        warning.classList.remove('hidden');
    } else {
        warning.classList.add('hidden');
    }

    // Show result with smooth scroll
    resultDiv.classList.remove('hidden');
    resultDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// Check backend health on page load
async function checkBackendHealth() {
    try {
        const response = await fetch(`${API_URL}/health`);
        if (!response.ok) {
            console.warn('Backend health check failed');
            showBackendWarning();
        }
    } catch (error) {
        console.warn('Backend not available. Please start the backend server.');
        showBackendWarning();
    }
}

function showBackendWarning() {
    const warning = document.createElement('div');
    warning.className = 'backend-warning';
    warning.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%);
        border: 2px solid #fecaca;
        border-radius: 12px;
        padding: 16px 20px;
        color: #dc2626;
        font-weight: 600;
        z-index: 1000;
        box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
        animation: slideIn 0.3s ease-out;
    `;
    warning.innerHTML = `
        <div style="display: flex; align-items: center; gap: 10px;">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            <span>Backend not connected. Start the server to enable predictions.</span>
        </div>
    `;
    document.body.appendChild(warning);
    
    // Add animation keyframes
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        .spinner {
            animation: spin 1s linear infinite;
        }
        @keyframes spin {
            from {
                transform: rotate(0deg);
            }
            to {
                transform: rotate(360deg);
            }
        }
    `;
    document.head.appendChild(style);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        warning.style.animation = 'slideIn 0.3s ease-out reverse';
        setTimeout(() => warning.remove(), 300);
    }, 5000);
}

// Run health check on load
checkBackendHealth();

// Show notification function
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
        color: white;
        border-radius: 12px;
        z-index: 10000;
        font-family: 'Inter', sans-serif;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        animation: slideIn 0.3s ease;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Logout functionality
document.addEventListener('DOMContentLoaded', function() {
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }
});

function handleLogout() {
    // Clear user session from localStorage
    localStorage.removeItem('userLogin');
    localStorage.removeItem('userProfile');
    
    // Show notification
    showNotification('Logging out...', 'info');
    
    // Redirect to login page
    setTimeout(() => {
        window.location.href = 'login.html';
    }, 500);
}
