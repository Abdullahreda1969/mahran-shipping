// src/js/modal.js - النسخة المحدثة
class ShipmentModal {
    constructor(onShipmentAdded = null) {
        this.modal = null;
        this.shipments = []; // تخزين الشحنات
        this.onShipmentAdded = onShipmentAdded; // callback عند إضافة شحنة
        this.init();
    }
    
    init() {
        this.createModal();
        this.bindEvents();
        this.loadShipments(); // تحميل الشحنات المحفوظة
    }
    
    createModal() {
        // إنشاء عنصر النافذة
        const modalDiv = document.createElement('div');
        modalDiv.id = 'shipmentModal';
        modalDiv.className = 'modal';
        modalDiv.innerHTML = `
            <div class="modal-content">
                <!-- رأس النافذة -->
                <div class="modal-header">
                    <h2>➕ إضافة شحنة جديدة</h2>
                    <button class="close-modal">&times;</button>
                </div>
                
                <!-- جسم النافذة -->
                <div class="modal-body">
                    <!-- عرض السعر -->
                    <div class="price-summary">
                        <div class="price-item">
                            <span>السعر الأساسي:</span>
                            <span id="basePrice">0 ريال</span>
                        </div>
                        <div class="price-item">
                            <span>الرسوم الإضافية:</span>
                            <span id="additionalFees">0 ريال</span>
                        </div>
                        <div class="price-total">
                            <span>الإجمالي:</span>
                            <span id="totalPrice">0 ريال</span>
                        </div>
                    </div>
                    
                    <!-- نموذج الإضافة -->
                    <form id="shipmentForm">
                        <!-- معلومات المرسل -->
                        <div class="form-section">
                            <h3>📤 معلومات المرسل</h3>
                            <div class="form-row">
                                <div class="form-group">
                                    <label for="senderName">اسم المرسل *</label>
                                    <input type="text" id="senderName" placeholder="اسم الشركة/الشخص" required>
                                </div>
                                <div class="form-group">
                                    <label for="senderPhone">هاتف المرسل *</label>
                                    <input type="tel" id="senderPhone" placeholder="05XXXXXXXX" required>
                                </div>
                            </div>
                            
                            <div class="form-group">
                                <label for="senderAddress">عنوان المرسل</label>
                                <textarea id="senderAddress" rows="2" placeholder="عنوان المرسل"></textarea>
                            </div>
                        </div>
                        
                        <!-- معلومات المرسل إليه -->
                        <div class="form-section">
                            <h3>📥 معلومات المرسل إليه</h3>
                            <div class="form-row">
                                <div class="form-group">
                                    <label for="receiverName">اسم المستلم *</label>
                                    <input type="text" id="receiverName" placeholder="اسم المستلم" required>
                                </div>
                                <div class="form-group">
                                    <label for="receiverPhone">هاتف المستلم *</label>
                                    <input type="tel" id="receiverPhone" placeholder="05XXXXXXXX" required>
                                </div>
                            </div>
                            
                            <div class="form-group">
                                <label for="receiverAddress">عنوان التسليم *</label>
                                <textarea id="receiverAddress" rows="2" placeholder="الحي، الشارع، المدينة" required></textarea>
                            </div>
                        </div>
                        
                        <!-- معلومات الشحنة -->
                        <div class="form-section">
                            <h3>📦 معلومات الشحنة</h3>
                            <div class="form-row">
                                <div class="form-group">
                                    <label for="shipmentWeight">الوزن (كجم) *</label>
                                    <input type="number" id="shipmentWeight" min="0.1" step="0.1" value="1" required>
                                    <small>أدخل الوزن بالكيلوجرام</small>
                                </div>
                                <div class="form-group">
                                    <label for="shipmentType">نوع الشحن *</label>
                                    <select id="shipmentType" required>
                                        <option value="عادي">عادي - 25 ريال/كجم</option>
                                        <option value="سريع">سريع - 40 ريال/كجم</option>
                                        <option value="بريد سريع">بريد سريع - 60 ريال/كجم</option>
                                        <option value="اقتصادي">اقتصادي - 15 ريال/كجم</option>
                                    </select>
                                </div>
                            </div>
                            
                            <div class="form-group">
                                <label for="shipmentDescription">وصف الشحنة</label>
                                <textarea id="shipmentDescription" rows="2" placeholder="وصف مختصر للمحتويات"></textarea>
                            </div>
                        </div>
                        
                        <!-- خدمات إضافية -->
                        <div class="form-section">
                            <h3>✨ خدمات إضافية</h3>
                            <div class="services-grid">
                                <label class="service-checkbox">
                                    <input type="checkbox" name="additionalServices" value="تأمين">
                                    <span>🛡️ تأمين (+10 ريال)</span>
                                </label>
                                <label class="service-checkbox">
                                    <input type="checkbox" name="additionalServices" value="تغليف">
                                    <span>📦 تغليف (+5 ريال)</span>
                                </label>
                                <label class="service-checkbox">
                                    <input type="checkbox" name="additionalServices" value="توصيل منباب">
                                    <span>🚪 توصيل من الباب (+15 ريال)</span>
                                </label>
                            </div>
                        </div>
                        
                        <!-- حالة الدفع -->
                        <div class="form-section">
                            <h3>💳 حالة الدفع</h3>
                            <div class="form-row">
                                <div class="form-group">
                                    <label for="paymentStatus">حالة الدفع</label>
                                    <select id="paymentStatus">
                                        <option value="غير مدفوع">غير مدفوع</option>
                                        <option value="مدفوع جزئياً">مدفوع جزئياً</option>
                                        <option value="مدفوع بالكامل">مدفوع بالكامل</option>
                                    </select>
                                </div>
                                <div class="form-group" id="paidAmountGroup" style="display: none;">
                                    <label for="paidAmount">المبلغ المدفوع (ريال)</label>
                                    <input type="number" id="paidAmount" min="0" step="1">
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
                
                <!-- تذييل النافذة -->
                <div class="modal-footer">
                    <button type="button" class="btn-secondary close-modal">إلغاء</button>
                    <button type="submit" form="shipmentForm" class="btn-primary">حفظ الشحنة</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modalDiv);
        this.modal = modalDiv;
    }
    
    bindEvents() {
        // زر إغلاق النافذة
        const closeButtons = this.modal.querySelectorAll('.close-modal');
        closeButtons.forEach(btn => {
            btn.addEventListener('click', () => this.close());
        });
        
        // إغلاق عند النقر خارج النافذة
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.close();
            }
        });
        
        // تحديث السعر عند تغيير البيانات
        this.bindPriceUpdates();
        
        // إرسال النموذج
        const form = this.modal.querySelector('#shipmentForm');
        form.addEventListener('submit', (e) => this.handleSubmit(e));
        
        // حالة الدفع
        const paymentStatus = this.modal.querySelector('#paymentStatus');
        paymentStatus.addEventListener('change', () => this.togglePaidAmount());
    }
    
    bindPriceUpdates() {
        const inputs = this.modal.querySelectorAll('#shipmentWeight, #shipmentType, [name="additionalServices"]');
        inputs.forEach(input => {
            input.addEventListener('change', () => this.updatePrice());
            input.addEventListener('input', () => this.updatePrice());
        });
    }
    
    updatePrice() {
        const weight = parseFloat(this.modal.querySelector('#shipmentWeight').value) || 0;
        const shippingType = this.modal.querySelector('#shipmentType').value;
        const checkboxes = this.modal.querySelectorAll('[name="additionalServices"]:checked');
        const additionalServices = Array.from(checkboxes).map(cb => cb.value);
        
        const baseRate = this.getShippingRate(shippingType);
        const basePrice = weight * baseRate;
        
        let additionalFees = 0;
        additionalServices.forEach(service => {
            additionalFees += this.getAdditionalFee(service);
        });
        
        const totalPrice = basePrice + additionalFees;
        
        this.modal.querySelector('#basePrice').textContent = `${basePrice.toFixed(2)} ريال`;
        this.modal.querySelector('#additionalFees').textContent = `${additionalFees.toFixed(2)} ريال`;
        this.modal.querySelector('#totalPrice').textContent = `${totalPrice.toFixed(2)} ريال`;
    }
    
    getShippingRate(type) {
        const rates = {
            'عادي': 25,
            'سريع': 40,
            'بريد سريع': 60,
            'اقتصادي': 15
        };
        return rates[type] || 25;
    }
    
    getAdditionalFee(service) {
        const fees = {
            'تأمين': 10,
            'تغليف': 5,
            'توصيل منباب': 15
        };
        return fees[service] || 0;
    }
    
    togglePaidAmount() {
        const status = this.modal.querySelector('#paymentStatus').value;
        const paidAmountGroup = this.modal.querySelector('#paidAmountGroup');
        
        if (status === 'مدفوع جزئياً' || status === 'مدفوع بالكامل') {
            paidAmountGroup.style.display = 'block';
        } else {
            paidAmountGroup.style.display = 'none';
        }
    }
    
    open() {
        this.modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
        this.updatePrice();
    }
    
    close() {
        this.modal.style.display = 'none';
        document.body.style.overflow = 'auto';
        this.resetForm();
    }
    
    resetForm() {
        const form = this.modal.querySelector('#shipmentForm');
        form.reset();
        this.updatePrice();
        this.modal.querySelector('#paidAmountGroup').style.display = 'none';
    }
    
    generateTrackingNumber() {
        return 'MAH' + Date.now().toString().slice(-8) + Math.random().toString(36).substr(2, 4).toUpperCase();
    }
    
    handleSubmit(e) {
        e.preventDefault();
        
        // جمع البيانات
        const shipmentData = {
            id: Date.now(),
            trackingNumber: this.generateTrackingNumber(),
            
            // معلومات المرسل
            senderName: this.modal.querySelector('#senderName').value,
            senderPhone: this.modal.querySelector('#senderPhone').value,
            senderAddress: this.modal.querySelector('#senderAddress').value,
            
            // معلومات المرسل إليه
            receiverName: this.modal.querySelector('#receiverName').value,
            receiverPhone: this.modal.querySelector('#receiverPhone').value,
            receiverAddress: this.modal.querySelector('#receiverAddress').value,
            
            // معلومات الشحنة
            weight: parseFloat(this.modal.querySelector('#shipmentWeight').value),
            shippingType: this.modal.querySelector('#shipmentType').value,
            description: this.modal.querySelector('#shipmentDescription').value,
            additionalServices: Array.from(this.modal.querySelectorAll('[name="additionalServices"]:checked')).map(cb => cb.value),
            
            // السعر
            shippingRate: this.getShippingRate(this.modal.querySelector('#shipmentType').value),
            additionalFees: this.getAdditionalFeeTotal(),
            totalPrice: this.calculateTotalPrice(),
            
            // حالة الدفع
            paymentStatus: this.modal.querySelector('#paymentStatus').value,
            paidAmount: parseFloat(this.modal.querySelector('#paidAmount').value) || 0,
            
            // تاريخ
            createdAt: new Date().toISOString(),
            status: 'جديد'
        };
        
        // إضافة الشحنة
        this.addShipment(shipmentData);
        
        // إغلاق النافذة
        this.close();
        
        // عرض رسالة نجاح
        this.showSuccessMessage(`تم إضافة الشحنة بنجاح! رقم التتبع: ${shipmentData.trackingNumber}`);
    }
    
    getAdditionalFeeTotal() {
        const checkboxes = this.modal.querySelectorAll('[name="additionalServices"]:checked');
        let total = 0;
        checkboxes.forEach(cb => {
            total += this.getAdditionalFee(cb.value);
        });
        return total;
    }
    
    calculateTotalPrice() {
        const weight = parseFloat(this.modal.querySelector('#shipmentWeight').value) || 0;
        const shippingType = this.modal.querySelector('#shipmentType').value;
        const baseRate = this.getShippingRate(shippingType);
        const basePrice = weight * baseRate;
        const additionalFees = this.getAdditionalFeeTotal();
        return basePrice + additionalFees;
    }
    
    addShipment(shipmentData) {
        // إضافة الشحنة للمصفوفة
        this.shipments.push(shipmentData);
        
        // حفظ في localStorage
        this.saveShipments();
        
        // استدعاء callback إذا موجود
        if (this.onShipmentAdded) {
            this.onShipmentAdded(shipmentData);
        }
        
        console.log('تمت إضافة الشحنة:', shipmentData);
    }
    
    saveShipments() {
        localStorage.setItem('mahran_shipments', JSON.stringify(this.shipments));
    }
    
    loadShipments() {
        const saved = localStorage.getItem('mahran_shipments');
        if (saved) {
            this.shipments = JSON.parse(saved);
        }
    }
    
    getShipments() {
        return this.shipments;
    }
    
    showSuccessMessage(message) {
        // إنشاء نافذة تنبيه جميلة
        const alertDiv = document.createElement('div');
        alertDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #4CAF50;
            color: white;
            padding: 15px 25px;
            border-radius: 10px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.2);
            z-index: 1001;
            animation: slideInRight 0.3s ease;
        `;
        
        alertDiv.innerHTML = `
            <div style="display: flex; align-items: center; gap: 10px;">
                <span style="font-size: 1.5em;">✅</span>
                <span>${message}</span>
            </div>
        `;
        
        document.body.appendChild(alertDiv);
        
        // إزالة التنبيه بعد 3 ثواني
        setTimeout(() => {
            alertDiv.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => {
                if (alertDiv.parentNode) {
                    alertDiv.parentNode.removeChild(alertDiv);
                }
            }, 300);
        }, 3000);
        
        // إضافة أنماط للـ animation
        if (!document.querySelector('#alertStyles')) {
            const style = document.createElement('style');
            style.id = 'alertStyles';
            style.textContent = `
                @keyframes slideInRight {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                @keyframes slideOutRight {
                    from { transform: translateX(0); opacity: 1; }
                    to { transform: translateX(100%); opacity: 0; }
                }
            `;
            document.head.appendChild(style);
        }
    }
}

// جعل الكلاس متاحاً عالمياً
window.ShipmentModal = ShipmentModal;
