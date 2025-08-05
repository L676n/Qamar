  // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";

  import { getFirestore, collection, addDoc, serverTimestamp, onSnapshot, query, orderBy } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  const firebaseConfig = {
    apiKey: "AIzaSyDk4jt0W0IgvAYcetDIruaG-A6GHFeOfMI",
    authDomain: "congrats-baby.firebaseapp.com",
    projectId: "congrats-baby",
    storageBucket: "congrats-baby.firebasestorage.app",
    messagingSenderId: "784965695153",
    appId: "1:784965695153:web:0759ad1f6fb4a4fce9d490"
  };

  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);

  const commentInput = document.getElementById('comment-input');
  const commentName = document.getElementById('comment-name');
  const submitBtn = document.getElementById('submit-comment');
  const commentsContainer = document.getElementById('comments-container');
submitBtn.addEventListener('click', async () => {
  const text = commentInput.value.trim();
  const name = commentName.value.trim();

  if (text && name) {
    await addDoc(collection(db, "comments"), {
      text: text,
      name: name,
      timestamp: serverTimestamp()
    });

    commentInput.value = '';
    commentName.value = '';
  }
});

// Load and display comments
const q = query(collection(db, "comments"), orderBy("timestamp", "asc"));
onSnapshot(q, (snapshot) => {
  commentsContainer.innerHTML = '';
  snapshot.forEach((doc) => {
    const comment = doc.data();

    let hijriDate = '';
    let time = '';

    if (comment.timestamp) {
      const date = comment.timestamp.toDate();

      // Format Hijri date
      hijriDate = new Intl.DateTimeFormat('ar-SA-u-ca-islamic', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      }).format(date);

      // Format Arabic time
      time = new Intl.DateTimeFormat('ar-SA', {
        hour: 'numeric',
        minute: 'numeric',
        hour12: true
      }).format(date);
    }

    const template = document.getElementById('comment-template');

        onSnapshot(q, (snapshot) => {
        commentsContainer.innerHTML = '';
        snapshot.forEach((doc) => {
            const comment = doc.data();

            const clone = template.content.cloneNode(true);
            clone.querySelector('.comment-name').textContent = comment.name || 'بدون اسم';
            clone.querySelector('.comment-text').textContent = comment.text;

            // Format date to Hijri and Arabic time (as you already did)
            const date = comment.timestamp?.toDate?.();
            const hijriDate = date ? new Intl.DateTimeFormat('ar-SA-u-ca-islamic', { dateStyle: 'long' }).format(date) : 'تاريخ غير متوفر';
            const time = date ? date.toLocaleTimeString('ar-EG') : '';

            clone.querySelector('.comment-date').textContent = `نشر في ${hijriDate} الساعة ${time}`;

            commentsContainer.appendChild(clone);
        });
    });

  });
});


