// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";

import { getFirestore, collection, addDoc, serverTimestamp, query,orderBy, startAfter, endBefore, limit, limitToLast, getDocs } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

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

  const isNameValid = /^([\u0621-\u064A\u0660-\u0669\d]+)\s+([\u0621-\u064A\u0660-\u0669\d]+)$/.test(name);

  const isCommentValid = /^[\u0621-\u064A\u0660-\u0669\u06F0-\u06F9\w\s\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]+$/u.test(text);


  nameError.textContent = isNameValid ? '' : "الرجاء إدخال الاسم الأول والأخير فقط";
  commentError.textContent = isCommentValid ? '' : "الرجاء كتابة تعليق يحتوي على حروف وأرقام فقط";

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

  let q = query(collection(db, "comments"), orderBy("timestamp", "asc"), limit(commentsPerPage));

  if (direction === "next" && lastVisible) {
    q = query(collection(db, "comments"), orderBy("timestamp", "asc"), startAfter(lastVisible), limit(commentsPerPage));
    currentPage++;
  } else if (direction === "prev" && firstVisible) {
    q = query(collection(db, "comments"), orderBy("timestamp", "asc"), endBefore(firstVisible), limitToLast(commentsPerPage));
    currentPage--;
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
      const hijriDate = date ? new Intl.DateTimeFormat('ar-SA-u-ca-islamic', { dateStyle: 'long' }).format(date) : 'تاريخ غير متوفر';
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
        speakerIcon.src = 'volume-mute-fill.svg';
    } else {
        speakerIcon.src = 'volume-up-fill.svg';
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



















