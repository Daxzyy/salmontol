const SECURE_PASSWORD = process.env.MY_SECRET_PASSWORD;

const SENSITIVE_DATA = {
    name: 'Salma apriliyani salsabilanjing',
    residence: 'Sidobasuki, rt/rw 25/12. kel. bumiagung. kec tegineneng. kab. pesawaran, lampung',
    dob: '5 April 2008',
    religion: 'Islam',
    school: 'SMAN 2 TEGINENENG',
    phone: '+62 882-8627-2458',
    father: 'Sugiarto',
    mother: 'Prapti',
    skin: 'Negro, Suki',
    brain: 'Autism, goblok, tolol, dongo',
    attitude: 'Egois, Playing Victim, Sok Keras',
    vocab: 'Only, Batu Nisan, Angpao',
    ex: 'Devan, Rey, Husein, Arya, Adit, Tino, Kevin, Iky, Charless',
    veryImportantPhoto: '1.jpg',
    gallery: [
        '1.jpg', '2.jpg', '3.jpg', '4.jpg', '5.jpg', 
        '6.jpg', '7.jpg', '8.jpg', '9.jpg', '10.jpg', 
        '11.jpg', '12.jpg', '13.jpg', '14.jpg', '15.jpg'
    ]
};

export default async (req, res) => {
    if (req.method !== 'POST') {
        return res.status(405).json({ success: false, message: 'Method Not Allowed' });
    }

    if (!SECURE_PASSWORD) {
        return res.status(500).json({ success: false, message: 'Server Configuration Error: Password Env Var not set' });
    }

    try {
        const { password } = req.body;

        if (password === SECURE_PASSWORD) {
            return res.status(200).json({ success: true, data: SENSITIVE_DATA });
        } else {
            return res.status(200).json({ success: false, message: 'Incorrect Password' });
        }
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};
