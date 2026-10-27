const SESSION_KEY = 'vault_session';
const SESSION_DURATION_MS = 7 * 24 * 60 * 60 * 1000;

const ICON_VISIBILITY_ON = '<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" width="20" height="20" viewBox="0 0 24 24"><path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/></svg>';

const ICON_VISIBILITY_OFF = '<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" width="20" height="20" viewBox="0 0 24 24"><path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z"/></svg>';

function saveSession(password) {
    try {
        localStorage.setItem(SESSION_KEY, JSON.stringify({
            password,
            expiresAt: Date.now() + SESSION_DURATION_MS
        }));
    } catch (error) {
        return;
    }
}

function clearSession() {
    try {
        localStorage.removeItem(SESSION_KEY);
    } catch (error) {
        return;
    }
}

function loadSession() {
    try {
        const raw = localStorage.getItem(SESSION_KEY);
        if (!raw) return null;
        const session = JSON.parse(raw);
        if (!session.password || Date.now() > session.expiresAt) {
            clearSession();
            return null;
        }
        return session.password;
    } catch (error) {
        return null;
    }
}

async function fetchSensitiveData(password) {
    try {
        const response = await fetch('/api/data', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ password }),
        });
        const data = await response.json();
        return data.success ? data.data : null;
    } catch (error) {
        return null;
    }
}

function calculateAge(birthDate) {
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) age--;
    return age;
}

function renderContent(data) {
    const age = calculateAge(new Date('2008-04-05'));
    const phoneLink = `https://wa.me/${data.phone.replace(/[^0-9+]/g, '')}?text=p`;
    const galleryHtml = data.gallery
        .map(url => `<img src="${url}" alt="Gallery photo" loading="lazy">`)
        .join('');

    const contentHtml = `
    <div class="peler">Private profile</div>

    <div class="important-section">
        <span class="label-warn"><i class="fa-solid fa-star"></i> Highlights</span>
        <div class="image-container-vip">
            <img src="penting.jpg" alt="Highlight 1">
            <img src="penting2.png" alt="Highlight 2">
        </div>
    </div>

    <div class="info-grid">
        <div class="list"><span>Name</span><div class="text"><i class="fa-solid fa-user-tie"></i> ${data.name}</div></div>
        <div class="list"><span>Residence</span><div class="map"><i class="fa-solid fa-location-dot"></i> ${data.residence}</div></div>
        <div class="list"><span>DOB / Age</span><div class="text"><i class="fa-solid fa-cake-candles"></i> ${data.dob} (${age} Tahun)</div></div>
        <div class="list"><span>Religion</span><div class="text"><i class="fa-solid fa-kaaba"></i> ${data.religion}</div></div>
        <div class="list"><span>School</span><div class="text"><i class="fa-solid fa-school"></i> ${data.school}</div></div>
        <div class="list"><span>WhatsApp</span><div class="link"><i class="fab fa-whatsapp"></i> <a href="${phoneLink}" target="_blank" rel="noopener">${data.phone}</a></div></div>
        <div class="list"><span>Father's Name</span><div class="text"><i class="fa-solid fa-person"></i> ${data.father}</div></div>
        <div class="list"><span>Mother's Name</span><div class="text"><i class="fa-solid fa-person-dress"></i> ${data.mother}</div></div>
        <div class="list"><span>Skin</span><div class="text"><i class="fa-solid fa-user"></i> ${data.skin}</div></div>
        <div class="list"><span>Brain Status</span><div class="text"><i class="fa-solid fa-brain"></i> ${data.brain}</div></div>
        <div class="list"><span>Attitude</span><div class="text"><i class="fa-solid fa-mask"></i> ${data.attitude}</div></div>
        <div class="list"><span>Vocabulary</span><div class="text"><i class="fa-solid fa-book"></i> ${data.vocab}</div></div>
        <div class="list"><span>Ex-Partners</span><div class="text"><i class="fa-solid fa-heart-crack"></i> ${data.ex}</div></div>
    </div>

    <details>
        <summary>Open gallery</summary>
        <div class="image-container">${galleryHtml}</div>
    </details>
    `;

    document.getElementById('main-content').innerHTML = contentHtml;
}

function hideLoadingOverlay() {
    const overlay = document.getElementById('loading-overlay');
    if (overlay) overlay.style.display = 'none';
}

function showContent(data) {
    renderContent(data);
    document.getElementById('main-content').style.display = 'block';
    hideLoadingOverlay();
}

function attachVisibilityToggle() {
    const input = Swal.getInput();
    if (!input) return;

    const wrapper = document.createElement('div');
    wrapper.className = 'password-field';
    input.parentNode.insertBefore(wrapper, input);
    wrapper.appendChild(input);

    const toggle = document.createElement('button');
    toggle.type = 'button';
    toggle.className = 'password-toggle';
    toggle.setAttribute('aria-label', 'Show password');
    toggle.innerHTML = ICON_VISIBILITY_OFF;

    toggle.addEventListener('click', () => {
        const isHidden = input.type === 'password';
        input.type = isHidden ? 'text' : 'password';
        toggle.innerHTML = isHidden ? ICON_VISIBILITY_ON : ICON_VISIBILITY_OFF;
        toggle.setAttribute('aria-label', isHidden ? 'Hide password' : 'Show password');
        input.focus();
    });

    wrapper.appendChild(toggle);
}

function showPasswordPrompt() {
    hideLoadingOverlay();

    Swal.fire({
        title: 'Enter password',
        input: 'password',
        inputPlaceholder: 'Password',
        confirmButtonText: 'Unlock',
        allowOutsideClick: false,
        backdrop: 'rgba(217, 213, 200, 0.96)',
        didOpen: attachVisibilityToggle
    }).then(async (result) => {
        if (!result.isConfirmed) return;

        Swal.fire({
            title: 'Checking...',
            allowOutsideClick: false,
            didOpen: () => Swal.showLoading()
        });

        const data = await fetchSensitiveData(result.value);
        Swal.close();

        if (data) {
            saveSession(result.value);
            showContent(data);
            return;
        }

        Swal.fire({
            icon: 'error',
            title: 'Wrong password',
            text: 'Try again.'
        }).then(showPasswordPrompt);
    });
}

async function init() {
    const savedPassword = loadSession();

    if (savedPassword) {
        const data = await fetchSensitiveData(savedPassword);
        if (data) {
            showContent(data);
            return;
        }
        clearSession();
    }

    showPasswordPrompt();
}

document.addEventListener('DOMContentLoaded', init);
