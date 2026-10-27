async function fetchSensitiveData(password) {
    const response = await fetch('/api/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
    });
    const data = await response.json();
    return data.success ? data.data : null;
}

function renderContent(data) {
    const calculateAge = () => {
        const birthDate = new Date('2008-04-05');
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) age--;
        return age;
    };
    
    const age = calculateAge();
    const phoneLink = `https://wa.me/${data.phone.replace(/[^0-9+]/g, '')}?text=p`;
    const galleryHtml = data.gallery.map(url => `<img src="${url}" alt="Img" loading="lazy">`).join('');

    const contentHtml = `
    <div class="peler">Access Granted: encrypted_session_active</div>

    <div class="important-section">
        <span class="label-warn"><i class="fas fa-biohazard"></i> HIGH PRIORITY DATA</span>
        <div class="image-container-vip">
            <img src="penting.jpg" alt="V1">
            <img src="penting2.png" alt="V2">
        </div>
    </div>
    
   <div class="info-grid">
        <div class="list"><span>Name</span><div class="text"><i class="fa-solid fa-user-tie"></i> ${data.name}</div></div>
        <div class="list"><span>Residence</span><div class="map"><i class="fa-solid fa-location-dot"></i> ${data.residence}</div></div>
        <div class="list"><span>DOB / Age</span><div class="text"><i class="fa-solid fa-cake-candles"></i> ${data.dob} (${age} Tahun)</div></div>
        <div class="list"><span>Religion</span><div class="text"><i class="fa-solid fa-kaaba"></i> ${data.religion}</div></div>
        <div class="list"><span>School</span><div class="text"><i class="fa-solid fa-school"></i> ${data.school}</div></div>
        <div class="list"><span>WhatsApp</span><div class="link"><i class="fab fa-whatsapp"></i> <a href="${phoneLink}" target="_blank">${data.phone}</a></div></div>
        <div class="list"><span>Father's Name</span><div class="text"><i class="fa-solid fa-person"></i> ${data.father}</div></div>
        <div class="list"><span>Mother's Name</span><div class="text"><i class="fa-solid fa-person-dress"></i> ${data.mother}</div></div>
        <div class="list"><span>Skin</span><div class="text"><i class="fa-solid fa-user"></i> ${data.skin}</div></div>
        <div class="list"><span>Brain Status</span><div class="text"><i class="fa-solid fa-brain"></i> ${data.brain}</div></div>
        <div class="list"><span>Attitude</span><div class="text"><i class="fa-solid fa-mask"></i> ${data.attitude}</div></div>
        <div class="list"><span>Vocabulary</span><div class="text"><i class="fa-solid fa-book"></i> ${data.vocab}</div></div>
        <div class="list"><span>Ex-Partners</span><div class="text"><i class="fa-solid fa-heart-crack"></i> ${data.ex}</div></div>
    </div>    <details>
      <summary>OPEN ARCHIVE GALLERY</summary>
      <div class="image-container">${galleryHtml}</div>
    </details>
    `;
    
    document.getElementById('main-content').innerHTML = contentHtml;
}

function showPasswordPrompt() {
    const overlay = document.getElementById('loading-overlay');
    if (overlay) overlay.style.display = 'none';

    Swal.fire({
        title: 'AUTHENTICATION REQUIRED',
        input: 'password',
        inputPlaceholder: 'Enter Secret Key...',
        confirmButtonText: 'UNLOCK SYSTEM',
        allowOutsideClick: false,
        backdrop: `rgba(3,7,18,0.95)`
    }).then(async (result) => {
        if (result.isConfirmed) {
            Swal.fire({ 
                title: 'Bypassing Security...', 
                didOpen: () => { Swal.showLoading(); } 
            });
            
            const data = await fetchSensitiveData(result.value);
            Swal.close();
            
            if (data) {
                renderContent(data);
                document.getElementById('main-content').style.display = 'block';
            } else {
                Swal.fire({ 
                    icon: 'error', 
                    title: 'INVALID KEY', 
                    text: 'System access denied.' 
                }).then(() => showPasswordPrompt());
            }
        }
    });
}

document.addEventListener('DOMContentLoaded', showPasswordPrompt);
