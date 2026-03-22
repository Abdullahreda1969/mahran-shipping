// src/js/app.js - التطبيق الرئيسي لـ al-mahran-mvp
console.log('al-mahran-mvp loaded');

class MahranMVP {
    constructor() {
        this.shipments = this.loadFromStorage() || [];
        this.init();
    }
    
    init() {
        console.log('Initializing al-mahran-mvp system...');
        this.renderShipments();
    }
    
    addShipment(shipment) {
        shipment.id = Date.now();
        shipment.createdAt = new Date().toISOString();
        shipment.status = 'جديد';
        
        this.shipments.push(shipment);
        this.saveToStorage();
        this.renderShipments();
        
        console.log('Shipment added:', shipment);
        return shipment;
    }
    
    renderShipments() {
        // سيتم تطوير هذا لاحقاً
        console.log('Total shipments:', this.shipments.length);
    }
    
    saveToStorage() {
        localStorage.setItem('mahran-shipments', JSON.stringify(this.shipments));
    }
    
    loadFromStorage() {
        const data = localStorage.getItem('mahran-shipments');
        return data ? JSON.parse(data) : null;
    }
}

// تهيئة التطبيق
const app = new MahranMVP();
