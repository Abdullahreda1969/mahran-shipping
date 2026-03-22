// src/js/shipments-list.js - النسخة المحدثة
class ShipmentsList {
    constructor(containerId = 'shipmentsList') {
        this.container = document.getElementById(containerId);
        this.shipments = [];
        this.modal = null; // سيتم ربطه بالنافذة المنبثقة
        this.init();
    }
    
    init() {
        this.loadShipments();
        this.render();
        this.setupViewModal(); // إعداد نافذة العرض
    }
    
    setModal(modalInstance) {
        this.modal = modalInstance;
    }
    
    loadShipments() {
        const saved = localStorage.getItem('mahran_shipments');
        this.shipments = saved ? JSON.parse(saved) : [];
    }
    
    saveShipments() {
        localStorage.setItem('mahran_shipments', JSON.stringify(this.shipments));
    }
    
    addShipment(shipment) {
        this.shipments.unshift(shipment);
        this.saveShipments();
        this.render();
    }
    
    removeShipment(id) {
        this.shipments = this.shipments.filter(shipment => shipment.id !== id);
        this.saveShipments();
        this.render();
    }
    
    getShipmentById(id) {
        return this.shipments.find(shipment => shipment.id === id);
    }
    
    updateShipment(id, updatedData) {
        const index = this.shipments.findIndex(s => s.id === id);
        if (index !== -1) {
            this.shipments[index] = { ...this.shipments[index], ...updatedData };
            this.saveShipments();
            this.render();
            return true;
        }
        return false;
    }
    
    setupViewModal() {
        // إنشاء نافذة عرض الشحنة
        const viewModal = document.createElement('div');
        viewModal.id = 'viewShipmentModal';
        viewModal.className = 'modal';
        viewModal.innerHTML = `
            <div class="modal-content" style="max-width: 700px;">
                <div class="modal-header">
                    <h2>👁️ عرض تفاصيل الشحنة</h2>
                    <button class="close-view-modal">&times;</button>
                </div>
                <div class="modal-body" id="viewShipmentContent">
                    <!-- سيتم ملؤها ديناميكياً -->
                </div>
                <div class="modal-footer">
                    <button class="btn-secondary close-view-modal">إغلاق</button>
                </div>
            </div>
        `;
        document.body.appendChild(viewModal);
        
        // أحداث إغلاق النافذة
        viewModal.querySelectorAll('.close-view-modal').forEach(btn => {
            btn.addEventListener('click', () => {
                viewModal.style.display = 'none';
                document.body.style.overflow = 'auto';
            });
        });
        
        viewModal.addEventListener('click', (e) => {
            if (e.target === viewModal) {
                viewModal.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        });
    }
    
    showShipmentDetails(id) {
        const shipment = this.getShipmentById(id);
        if (!shipment) {
            alert('الشحنة غير موجودة');
            return;
        }
        
        const modal = document.getElementById('viewShipmentModal');
        const content = document.getElementById('viewShipmentContent');
        
        // تنسيق تاريخ الإنشاء
        const createdDate = new Date(shipment.createdAt).toLocaleString('ar-SA', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
        
        // تنسيق حالة الدفع
        const paymentStatusText = {
            'غير مدفوع': 'غير مدفوع 🔴',
            'مدفوع جزئياً': 'مدفوع جزئياً 🟡',
            'مدفوع بالكامل': 'مدفوع بالكامل 🟢'
        }[shipment.paymentStatus] || shipment.paymentStatus;
        
        // تنسيق الخدمات الإضافية
        const servicesText = shipment.additionalServices && shipment.additionalServices.length > 0
            ? shipment.additionalServices.map(s => `<span class="service-tag">${s}</span>`).join('')
            : '<span style="color: #999;">لا توجد خدمات إضافية</span>';
        
        // إنشاء محتوى العرض
        content.innerHTML = `
            <div class="shipment-details">
                <!-- رقم التتبع -->
                <div class="detail-section">
                    <h3>🔢 رقم التتبع</h3>
                    <div class="tracking-number-large">${shipment.trackingNumber}</div>
                </div>
                
                <div class="details-grid">
                    <!-- معلومات المرسل -->
                    <div class="detail-card">
                        <h4>📤 المرسل</h4>
                        <div class="detail-item">
                            <strong>الاسم:</strong> ${shipment.senderName}
                        </div>
                        <div class="detail-item">
                            <strong>الهاتف:</strong> ${shipment.senderPhone}
                        </div>
                        ${shipment.senderAddress ? `
                        <div class="detail-item">
                            <strong>العنوان:</strong> ${shipment.senderAddress}
                        </div>` : ''}
                    </div>
                    
                    <!-- معلومات المستلم -->
                    <div class="detail-card">
                        <h4>📥 المستلم</h4>
                        <div class="detail-item">
                            <strong>الاسم:</strong> ${shipment.receiverName}
                        </div>
                        <div class="detail-item">
                            <strong>الهاتف:</strong> ${shipment.receiverPhone}
                        </div>
                        <div class="detail-item">
                            <strong>العنوان:</strong> ${shipment.receiverAddress}
                        </div>
                    </div>
                </div>
                
                <!-- وصف الشحنة -->
                <div class="detail-section">
                    <h3>📝 وصف الشحنة</h3>
                    <div class="description-box">
                        ${shipment.description || '<span style="color: #999;">لا يوجد وصف</span>'}
                    </div>
                </div>
                
                <!-- معلومات الشحنة -->
                <div class="details-grid">
                    <div class="detail-card">
                        <h4>⚖️ معلومات الوزن</h4>
                        <div class="detail-item">
                            <strong>الوزن:</strong> ${shipment.weight} كجم
                        </div>
                        <div class="detail-item">
                            <strong>نوع الشحن:</strong> ${shipment.shippingType}
                        </div>
                    </div>
                    
                    <div class="detail-card">
                        <h4>💰 المعلومات المالية</h4>
                        <div class="detail-item">
                            <strong>السعر الأساسي:</strong> ${(shipment.weight * shipment.shippingRate).toFixed(2)} ريال
                        </div>
                        <div class="detail-item">
                            <strong>الرسوم الإضافية:</strong> ${shipment.additionalFees.toFixed(2)} ريال
                        </div>
                        <div class="detail-item">
                            <strong>الإجمالي:</strong> <span class="total-price">${shipment.totalPrice.toFixed(2)} ريال</span>
                        </div>
                        <div class="detail-item">
                            <strong>حالة الدفع:</strong> ${paymentStatusText}
                        </div>
                        ${shipment.paidAmount > 0 ? `
                        <div class="detail-item">
                            <strong>المبلغ المدفوع:</strong> ${shipment.paidAmount.toFixed(2)} ريال
                        </div>` : ''}
                    </div>
                </div>
                
                <!-- الخدمات الإضافية -->
                <div class="detail-section">
                    <h3>✨ الخدمات الإضافية</h3>
                    <div class="services-container">
                        ${servicesText}
                    </div>
                </div>
                
                <!-- المعلومات العامة -->
                <div class="details-grid">
                    <div class="detail-card">
                        <h4>📅 معلومات النظام</h4>
                        <div class="detail-item">
                            <strong>تاريخ الإضافة:</strong> ${createdDate}
                        </div>
                        <div class="detail-item">
                            <strong>حالة الشحنة:</strong> 
                            <span class="status-badge ${this.getStatusClass(shipment.status)}">
                                ${this.getStatusIcon(shipment.status)} ${shipment.status}
                            </span>
                        </div>
                    </div>
                    
                    <div class="detail-card">
                        <h4>📊 الإجراءات</h4>
                        <div class="action-buttons-vertical">
                            <button class="btn-edit" onclick="editShipment(${shipment.id})">✏️ تعديل الشحنة</button>
                            <button class="btn-delete" onclick="deleteShipment(${shipment.id})">🗑️ حذف الشحنة</button>
                            <button class="btn-print" onclick="printShipment(${shipment.id})">🖨️ طباعة</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // إضافة الأنماط
        this.addViewStyles();
        
        // عرض النافذة
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }
    
    showEditModal(id) {
        if (this.modal) {
            // هنا يمكننا تطوير نافذة تعديل
            // حالياً نعرض رسالة
            alert(`سيتم تطوير نافذة التعديل قريباً للشحنة #${id}\n\nيمكنك حذف الشحنة وإضافتها مرة أخرى بالتعديلات المطلوبة.`);
            
            // بديل: عرض تفاصيل الشحنة للنظر
            this.showShipmentDetails(id);
        }
    }
    
    render() {
        if (!this.container) return;
        
        if (this.shipments.length === 0) {
            this.container.innerHTML = `
                <div class="empty-state">
                    <div style="font-size: 4em; margin-bottom: 20px; opacity: 0.3;">📦</div>
                    <h3 style="color: #666; margin-bottom: 10px;">لا توجد شحنات حالياً</h3>
                    <p style="color: #999; margin-bottom: 30px;">ابدأ بإضافة أول شحنة لنظامك</p>
                    <button class="add-first-shipment" onclick="document.getElementById('openModalBtn').click()">
                        ➕ إضافة أول شحنة
                    </button>
                </div>
            `;
            return;
        }
        
        let html = `
            <div class="shipments-header">
                <h2>📋 الشحنات (${this.shipments.length})</h2>
                <div class="shipments-stats">
                    <span class="stat-item">🟢 جاهزة: ${this.countByStatus('جديد')}</span>
                    <span class="stat-item">🟡 قيد التوصيل: ${this.countByStatus('قيد التوصيل')}</span>
                    <span class="stat-item">🔵 مكتملة: ${this.countByStatus('مكتمل')}</span>
                    <span class="stat-item">🔴 ملغاة: ${this.countByStatus('ملغى')}</span>
                </div>
            </div>
            
            <div class="shipments-table-container">
                <table class="shipments-table">
                    <thead>
                        <tr>
                            <th>رقم التتبع</th>
                            <th>من → إلى</th>
                            <th>الوزن/النوع</th>
                            <th>السعر</th>
                            <th>الوصف</th>
                            <th>الحالة</th>
                            <th>الإجراءات</th>
                        </tr>
                    </thead>
                    <tbody>
        `;
        
        this.shipments.forEach(shipment => {
            const statusClass = this.getStatusClass(shipment.status);
            const statusIcon = this.getStatusIcon(shipment.status);
            
            // وصف مختصر
            const shortDescription = shipment.description 
                ? (shipment.description.length > 30 
                    ? shipment.description.substring(0, 30) + '...' 
                    : shipment.description)
                : 'لا يوجد وصف';
            
            html += `
                <tr>
                    <td>
                        <strong class="tracking-number">${shipment.trackingNumber}</strong>
                        <small style="display: block; color: #666; font-size: 0.85em;">
                            ${this.formatDate(shipment.createdAt)}
                        </small>
                    </td>
                    <td>
                        <div style="margin-bottom: 5px;">
                            <small style="color: #666;">من:</small>
                            <div>${shipment.senderName}</div>
                        </div>
                        <div>
                            <small style="color: #666;">إلى:</small>
                            <div>${shipment.receiverName}</div>
                        </div>
                    </td>
                    <td>
                        <div>${shipment.weight} كجم</div>
                        <small style="color: #666;">${shipment.shippingType}</small>
                    </td>
                    <td>
                        <strong>${shipment.totalPrice.toFixed(2)} ريال</strong>
                        ${shipment.paymentStatus === 'مدفوع بالكامل' ? 
                          '<div style="color: #4CAF50; font-size: 0.85em;">💳 مدفوع</div>' : 
                          shipment.paymentStatus === 'مدفوع جزئياً' ?
                          '<div style="color: #FF9800; font-size: 0.85em;">💳 جزئي</div>' :
                          '<div style="color: #F44336; font-size: 0.85em;">💳 غير مدفوع</div>'}
                    </td>
                    <td>
                        <div title="${shipment.description || 'لا يوجد وصف'}">${shortDescription}</div>
                        ${shipment.additionalServices && shipment.additionalServices.length > 0 ? 
                          `<small style="color: #666;">+${shipment.additionalServices.length} خدمة</small>` : ''}
                    </td>
                    <td>
                        <span class="status-badge ${statusClass}">
                            ${statusIcon} ${shipment.status}
                        </span>
                    </td>
                    <td>
                        <div class="action-buttons">
                            <button class="btn-view" onclick="viewShipment(${shipment.id})" title="عرض التفاصيل">
                                👁️ عرض
                            </button>
                            <button class="btn-edit" onclick="editShipment(${shipment.id})" title="تعديل الشحنة">
                                ✏️ تعديل
                            </button>
                            <button class="btn-delete" onclick="deleteShipment(${shipment.id})" title="حذف الشحنة">
                                🗑️ حذف
                            </button>
                        </div>
                    </td>
                </tr>
            `;
        });
        
        html += `
                    </tbody>
                </table>
            </div>
            
            <!-- ملخص الإحصائيات -->
            <div class="summary-stats">
                <div class="summary-item">
                    <span>إجمالي الشحنات:</span>
                    <strong>${this.shipments.length}</strong>
                </div>
                <div class="summary-item">
                    <span>إجمالي القيمة:</span>
                    <strong>${this.shipments.reduce((sum, s) => sum + s.totalPrice, 0).toFixed(2)} ريال</strong>
                </div>
                <div class="summary-item">
                    <span>متوسط السعر:</span>
                    <strong>${(this.shipments.reduce((sum, s) => sum + s.totalPrice, 0) / this.shipments.length || 0).toFixed(2)} ريال</strong>
                </div>
            </div>
        `;
        
        this.container.innerHTML = html;
        this.addStyles();
    }
    
    addViewStyles() {
        if (!document.querySelector('#view-styles')) {
            const style = document.createElement('style');
            style.id = 'view-styles';
            style.textContent = `
                .shipment-details {
                    padding: 10px;
                }
                
                .detail-section {
                    margin-bottom: 25px;
                    padding-bottom: 15px;
                    border-bottom: 1px solid #eee;
                }
                
                .detail-section:last-child {
                    border-bottom: none;
                }
                
                .detail-section h3 {
                    color: #1a237e;
                    margin-bottom: 15px;
                    font-size: 1.2em;
                }
                
                .tracking-number-large {
                    font-family: 'Courier New', monospace;
                    font-size: 1.8em;
                    font-weight: bold;
                    color: #1a237e;
                    background: #f0f2ff;
                    padding: 15px;
                    border-radius: 10px;
                    text-align: center;
                    margin: 10px 0;
                    letter-spacing: 2px;
                }
                
                .details-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                    gap: 20px;
                    margin: 20px 0;
                }
                
                .detail-card {
                    background: #f8f9fa;
                    padding: 20px;
                    border-radius: 10px;
                    border: 1px solid #e9ecef;
                }
                
                .detail-card h4 {
                    color: #333;
                    margin-bottom: 15px;
                    padding-bottom: 10px;
                    border-bottom: 2px solid #dee2e6;
                }
                
                .detail-item {
                    margin-bottom: 10px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 8px 0;
                    border-bottom: 1px dashed #eee;
                }
                
                .detail-item:last-child {
                    border-bottom: none;
                }
                
                .detail-item strong {
                    color: #666;
                }
                
                .description-box {
                    background: white;
                    padding: 15px;
                    border-radius: 8px;
                    border: 1px solid #ddd;
                    min-height: 80px;
                    line-height: 1.6;
                    color: #444;
                }
                
                .services-container {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 10px;
                    margin-top: 10px;
                }
                
                .service-tag {
                    background: #e3f2fd;
                    color: #1565c0;
                    padding: 6px 12px;
                    border-radius: 15px;
                    font-size: 0.9em;
                    border: 1px solid #bbdefb;
                }
                
                .total-price {
                    color: #1a237e;
                    font-size: 1.2em;
                    font-weight: bold;
                }
                
                .action-buttons-vertical {
                    display: flex;
                    flex-direction: column;
                    gap: 10px;
                }
                
                .action-buttons-vertical button {
                    padding: 12px;
                    border: none;
                    border-radius: 8px;
                    cursor: pointer;
                    font-weight: 500;
                    transition: all 0.2s;
                    text-align: center;
                }
                
                .btn-edit {
                    background: #ff9800;
                    color: white;
                }
                
                .btn-delete {
                    background: #f44336;
                    color: white;
                }
                
                .btn-print {
                    background: #607d8b;
                    color: white;
                }
                
                .btn-edit:hover { background: #f57c00; }
                .btn-delete:hover { background: #d32f2f; }
                .btn-print:hover { background: #455a64; }
                
                .summary-stats {
                    display: flex;
                    justify-content: space-around;
                    background: #f8f9fa;
                    padding: 20px;
                    border-radius: 10px;
                    margin-top: 30px;
                    flex-wrap: wrap;
                    gap: 15px;
                }
                
                .summary-item {
                    text-align: center;
                    padding: 15px;
                }
                
                .summary-item span {
                    display: block;
                    color: #666;
                    margin-bottom: 5px;
                }
                
                .summary-item strong {
                    font-size: 1.3em;
                    color: #1a237e;
                }
                
                .add-first-shipment {
                    background: #4CAF50;
                    color: white;
                    border: none;
                    padding: 12px 30px;
                    border-radius: 8px;
                    font-size: 1.1em;
                    cursor: pointer;
                    transition: all 0.3s;
                }
                
                .add-first-shipment:hover {
                    background: #45a049;
                    transform: translateY(-2px);
                    box-shadow: 0 5px 15px rgba(76, 175, 80, 0.3);
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    // بقية الدوال تبقى كما هي
    countByStatus(status) {
        return this.shipments.filter(s => s.status === status).length;
    }
    
    getStatusClass(status) {
        const classes = {
            'جديد': 'status-new',
            'قيد التوصيل': 'status-in-progress',
            'مكتمل': 'status-completed',
            'ملغى': 'status-cancelled'
        };
        return classes[status] || 'status-default';
    }
    
    getStatusIcon(status) {
        const icons = {
            'جديد': '🟢',
            'قيد التوصيل': '🟡',
            'مكتمل': '🔵',
            'ملغى': '🔴'
        };
        return icons[status] || '⚪';
    }
    
    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('ar-SA', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    }
    
    addStyles() {
        if (!document.querySelector('#shipments-styles')) {
            const style = document.createElement('style');
            style.id = 'shipments-styles';
            style.textContent = `
                /* الأنماط السابقة تبقى كما هي */
                .shipments-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 20px;
                    flex-wrap: wrap;
                    gap: 15px;
                }
                
                .shipments-stats {
                    display: flex;
                    gap: 15px;
                    background: #f8f9fa;
                    padding: 10px 20px;
                    border-radius: 10px;
                    flex-wrap: wrap;
                }
                
                .stat-item {
                    display: flex;
                    align-items: center;
                    gap: 5px;
                    color: #666;
                }
                
                .shipments-table-container {
                    overflow-x: auto;
                    border-radius: 10px;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.05);
                }
                
                .shipments-table {
                    width: 100%;
                    border-collapse: collapse;
                    background: white;
                }
                
                .shipments-table th {
                    background: #f8f9fa;
                    padding: 15px;
                    text-align: right;
                    font-weight: 600;
                    color: #333;
                    border-bottom: 2px solid #dee2e6;
                }
                
                .shipments-table td {
                    padding: 15px;
                    border-bottom: 1px solid #eee;
                    vertical-align: middle;
                }
                
                .shipments-table tr:hover {
                    background: #f9f9f9;
                }
                
                .tracking-number {
                    color: #1a237e;
                    font-family: monospace;
                    font-size: 1.1em;
                }
                
                .status-badge {
                    display: inline-block;
                    padding: 6px 12px;
                    border-radius: 20px;
                    font-size: 0.9em;
                    font-weight: 500;
                }
                
                .status-new { background: #e8f5e9; color: #2e7d32; }
                .status-in-progress { background: #fff3e0; color: #f57c00; }
                .status-completed { background: #e3f2fd; color: #1565c0; }
                .status-cancelled { background: #ffebee; color: #c62828; }
                
                .action-buttons {
                    display: flex;
                    gap: 8px;
                    flex-wrap: wrap;
                }
                
                .btn-view, .btn-edit, .btn-delete {
                    padding: 6px 12px;
                    border: none;
                    border-radius: 5px;
                    cursor: pointer;
                    font-size: 0.85em;
                    transition: all 0.2s;
                }
                
                .btn-view { background: #e3f2fd; color: #1565c0; }
                .btn-edit { background: #fff3e0; color: #f57c00; }
                .btn-delete { background: #ffebee; color: #c62828; }
                
                .btn-view:hover { background: #bbdefb; }
                .btn-edit:hover { background: #ffe0b2; }
                .btn-delete:hover { background: #ffcdd2; }
                
                .empty-state {
                    text-align: center;
                    padding: 60px 20px;
                    color: #666;
                }
                
                @media (max-width: 768px) {
                    .shipments-header {
                        flex-direction: column;
                        align-items: stretch;
                    }
                    
                    .action-buttons {
                        flex-direction: column;
                    }
                    
                    .shipments-table {
                        font-size: 0.9em;
                    }
                    
                    .shipments-table th,
                    .shipments-table td {
                        padding: 10px 8px;
                    }
                    
                    .details-grid {
                        grid-template-columns: 1fr;
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }
}

// تحديث الدوال العامة
function viewShipment(id) {
    if (window.shipmentsListInstance) {
        window.shipmentsListInstance.showShipmentDetails(id);
    }
}

function editShipment(id) {
    if (window.shipmentsListInstance) {
        window.shipmentsListInstance.showEditModal(id);
    }
}

function deleteShipment(id) {
    if (confirm('هل أنت متأكد من حذف هذه الشحنة؟')) {
        if (window.shipmentsListInstance) {
            window.shipmentsListInstance.removeShipment(id);
            // عرض رسالة نجاح
            showSuccessMessage('تم حذف الشحنة بنجاح');
        }
    }
}

function printShipment(id) {
    alert(`سيتم تطوير ميزة الطباعة قريباً للشحنة #${id}`);
}

function showSuccessMessage(message) {
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
    
    setTimeout(() => {
        alertDiv.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            if (alertDiv.parentNode) {
                alertDiv.parentNode.removeChild(alertDiv);
            }
        }, 300);
    }, 3000);
}

// جعل الكلاس متاحاً عالمياً
window.ShipmentsList = ShipmentsList;
window.shipmentsListInstance = null;
