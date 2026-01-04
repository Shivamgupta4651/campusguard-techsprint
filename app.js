const firebaseConfig = {
  apiKey: "AIzaSyDfftwzfacaoUuk-Qhsw69BaHzXvGmonaU",
  authDomain: "campus-safety-techsprint.firebaseapp.com",
  projectId: "campus-safety-techsprint",
  storageBucket: "campus-safety-techsprint.firebasestorage.app",
  messagingSenderId: "854950608692",
  appId: "1:854950608692:web:fed11cdd3a988d468b2f61"
};

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, collection, addDoc, serverTimestamp, onSnapshot, query, orderBy } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

document.getElementById('locationBtn').onclick = () => {
  navigator.geolocation.getCurrentPosition(
    pos => document.getElementById('locationDisplay').textContent = `Lat:${pos.coords.latitude.toFixed(4)} Lng:${pos.coords.longitude.toFixed(4)}`
  );
};

document.getElementById('incidentForm').onsubmit = async e => {
  e.preventDefault();
  const desc = document.getElementById('description').value;
  await addDoc(collection(db, 'incidents'), {
    desc,
    time: serverTimestamp()
  });
  alert('Submitted!');
  document.getElementById('incidentForm').reset();
};

// Auto load reports
onSnapshot(query(collection(db, 'incidents'), orderBy('time', 'desc')), snap => {
  const div = document.getElementById('reports');
  div.innerHTML = '';
  let count = 0;
  snap.forEach(doc => {
    count++;
    const d = doc.data();
    const card = document.createElement('div');
    card.className = 'report-card';
    
    // Date formatting
    const date = d.time ? d.time.toDate() : new Date();
    const timeStr = date.toLocaleString('en-IN', {
      weekday: 'short',
      hour: '2-digit',
      minute: '2-digit',
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
    
    card.innerHTML = `
      <div class="report-category category-${d.category || 'other'}">${d.category || 'Report'}</div>
      <div style="font-size:1.1rem;margin:8px 0">${d.desc}</div>
      <div style="color:#a0a0a0;font-size:0.85rem">
        <i class="fas fa-clock"></i> ${timeStr}
      </div>
    `;
    div.appendChild(card);
  });
  
  document.getElementById('reportCount').textContent = count;
});

