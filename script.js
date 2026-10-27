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

function showPasswordPrompt() {
    const overlay = document.getElementById('loading-overlay');
    if (overlay) overlay.style.display = 'none';

    Swal.fire({
        title: 'Enter password',
        input: 'password',
        inputPlaceholder: 'Password',
        confirmButtonText: 'Unlock',
        allowOutsideClick: false,
        backdrop: 'rgba(245, 243, 238, 0.96)'
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
            renderContent(data);
            document.getElementById('main-content').style.display = 'block';
            return;
        }

        Swal.fire({
            icon: 'error',
            title: 'Wrong password',
            text: 'Try again.'
        }).then(showPasswordPrompt);
    });
}

document.addEventListener('DOMContentLoaded', showPasswordPrompt);
