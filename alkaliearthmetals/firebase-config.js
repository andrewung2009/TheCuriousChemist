// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBOp4x0lTFvmt2s3MQKBRYmZT9IJ2ZaRi8",
    authDomain: "group-1-alkali-metals.firebaseapp.com",
    databaseURL: "https://group-1-alkali-metals-default-rtdb.firebaseio.com",
    projectId: "group-1-alkali-metals",
    storageBucket: "group-1-alkali-metals.firebasestorage.app",
    messagingSenderId: "806417495419",
    appId: "1:806417495419:web:5b80607e8a23e96da4f9de",
    measurementId: "G-S76E52MQ37"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const database = firebase.database();

// Create a dedicated reference for Group 2 Metals data
const group2MetalsRef = database.ref('Group2Metals');
