// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";

import { getFirestore, collection, addDoc, serverTimestamp, query,orderBy, startAfter, endBefore, limit, limitToLast, getDocs } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
  const firebaseConfig = {
    apiKey: "AIzaSyA4jkha4eKVo93x1HvihYciE8myb9p0AxM",
    authDomain: "congrats-baby-2fcbd.firebaseapp.com",
    projectId: "congrats-baby-2fcbd",
    storageBucket: "congrats-baby-2fcbd.firebasestorage.app",
    messagingSenderId: "1098929567768",
    appId: "1:1098929567768:web:45857178f6a74120e1ab6d"
  };

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const commentInput = document.getElementById('comment-input');
const commentName = document.getElementById('comment-name');
const submitBtn = document.getElementById('submit-comment');
const commentsContainer = document.getElementById('comments-container');
const template = document.getElementById('comment-template');
const nameError = document.getElementById('name-error');
const commentError = document.getElementById('comment-error');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');

const pageNumberDisplay = document.getElementById('page-number');
let totalPages = 1;

async function updateTotalPages() {
  const snapshot = await getDocs(collection(db, "comments"));
  const totalComments = snapshot.size;
  totalPages = Math.ceil(totalComments / commentsPerPage);
}


submitBtn.addEventListener('click', async () => {
  const text = commentInput.value.trim();
  const name = commentName.value.trim();

  // Name: Arabic letters or digits, two or more words
  const isNameValid = /^([\u0621-\u064A\u0660-\u0669\d]+)(\s+[\u0621-\u064A\u0660-\u0669\d]+)+$/.test(name);

  // Comment: Allow Arabic, digits, Latin, spaces, punctuation, and emojis
  const isCommentValid = /^[\p{L}\p{N}\p{P}\p{Zs}\u0621-\u064A\u0660-\u0669\u06F0-\u06F9\u200C\u200D\uFE0F\u{1F300}-\u{1FAFF}]+$/u.test(text);

  nameError.textContent = isNameValid ? '' : "الرجاء إدخال الاسم الكامل (كلمتين أو أكثر)";
  commentError.textContent = isCommentValid ? '' : "الرجاء كتابة تعليق صحيح (يسمح باستخدام الرموز التعبيرية)";

  if (!isNameValid || !isCommentValid) return;

  await addDoc(collection(db, "comments"), {
    text,
    name,
    timestamp: serverTimestamp()
  });

  commentInput.value = '';
  commentName.value = '';
  nameError.textContent = '';
  commentError.textContent = '';
  currentPage = 1;
  loadComments();
});



let lastVisible = null;
let firstVisible = null;
let currentPage = 1;
const commentsPerPage = 3;

async function loadComments(direction = "none") {
  commentsContainer.innerHTML = '';

  let q;

  if (direction === "next" && lastVisible) {
    q = query(
      collection(db, "comments"),
      orderBy("timestamp", "desc"),
      startAfter(lastVisible),
      limit(commentsPerPage)
    );
    currentPage++;
  } else if (direction === "prev" && firstVisible) {
    q = query(
      collection(db, "comments"),
      orderBy("timestamp", "desc"),
      endBefore(firstVisible),
      limitToLast(commentsPerPage)
    );
    currentPage--;
  } else {
    // 👈 أول تحميل (أو تحديث) لازم يجيب أول صفحة عادي
    q = query(
      collection(db, "comments"),
      orderBy("timestamp", "desc"),
      limit(commentsPerPage)
    );
    currentPage = 1;
  }

  const snapshot = await getDocs(q);

  if (!snapshot.empty) {
    firstVisible = snapshot.docs[0];
    lastVisible = snapshot.docs[snapshot.docs.length - 1];

    snapshot.forEach((doc) => {
      const comment = doc.data();
      const clone = template.content.cloneNode(true);

      clone.querySelector('.comment-name').textContent = comment.name || 'بدون اسم';
      clone.querySelector('.comment-text').textContent = comment.text;

      const date = comment.timestamp?.toDate?.();
      const hijriDate = date
        ? new Intl.DateTimeFormat('ar-SA-u-ca-islamic', { dateStyle: 'long' }).format(date)
        : 'تاريخ غير متوفر';
      const time = date ? date.toLocaleTimeString('ar-EG') : '';

      clone.querySelector('.comment-date').textContent = `نشر في ${hijriDate} الساعة ${time}`;

      commentsContainer.appendChild(clone);
    });
  }

  await updateTotalPages();
  pageNumberDisplay.textContent = `صفحة ${currentPage} من ${totalPages}`;
  prevBtn.disabled = currentPage <= 1;
  nextBtn.disabled = currentPage >= totalPages;
}



nextBtn.addEventListener('click', () => {
  loadComments("next");
  commentInput.value = '';
  commentName.value = '';
  nameError.textContent = '';
  commentError.textContent = '';
});

prevBtn.addEventListener('click', () => {
  loadComments("prev");
  commentInput.value = '';
  commentName.value = '';
  nameError.textContent = '';
  commentError.textContent = '';
});


const audio = document.getElementById('song');
const speakerIcon = document.getElementById('speaker-icon');

// تحديث أيقونة الصوت
const updateIcon = () => {
    if (audio.muted || audio.paused) {
        // Set the icon's innerHTML to the "muted" SVG
        speakerIcon.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-volume-mute-fill" viewBox="0 0 16 16">
                <path d="M6.717 3.55A.5.5 0 0 1 7 4v8a.5.5 0 0 1-.812.39L3.825 10.5H1.5A.5.5 0 0 1 1 10V6a.5.5 0 0 1 .5-.5h2.325l2.363-1.89a.5.5 0 0 1 .529-.06m7.137 2.096a.5.5 0 0 1 0 .708L12.207 8l1.647 1.646a.5.5 0 0 1-.708.708L11.5 8.707l-1.646 1.647a.5.5 0 0 1-.708-.708L10.793 8 9.146 6.354a.5.5 0 1 1 .708-.708L11.5 7.293l1.646-1.647a.5.5 0 0 1 .708 0"/>
            </svg>`;
    } else {
        // Set the icon's innerHTML to the "unmuted" SVG
        speakerIcon.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="bi bi-volume-up-fill" viewBox="0 0 16 16" style="color: #ffffff;">
                <path d="M11.536 14.01A8.47 8.47 0 0 0 14.026 8a8.47 8.47 0 0 0-2.49-6.01l-.708.707A7.48 7.48 0 0 1 13.025 8c0 2.071-.84 3.946-2.197 5.303z"/>
                <path d="M10.121 12.596A6.48 6.48 0 0 0 12.025 8a6.48 6.48 0 0 0-1.904-4.596l-.707.707A5.48 5.48 0 0 1 11.025 8a5.48 5.48 0 0 1-1.61 3.89z"/>
                <path d="M8.707 11.182A4.5 4.5 0 0 0 10.025 8a4.5 4.5 0 0 0-1.318-3.182L8 5.525A3.5 3.5 0 0 1 9.025 8 3.5 3.5 0 0 1 8 10.475zM6.717 3.55A.5.5 0 0 1 7 4v8a.5.5 0 0 1-.812.39L3.825 10.5H1.5A.5.5 0 0 1 1 10V6a.5.5 0 0 1 .5-.5h2.325l2.363-1.89a.5.5 0 0 1 .529-.06"/>
            </svg>`;
    }
};


// عند الضغط على أيقونة السماعة
speakerIcon.addEventListener('click', () => {
    if (audio.muted || audio.paused) {
        audio.muted = false;
        audio.play();
    } else {
        audio.pause();
    }
    updateIcon();
});


window.onload = () => {
  loadComments();
};



















