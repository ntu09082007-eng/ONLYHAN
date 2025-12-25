// CẤU HÌNH SUPABASE (Giữ nguyên thông số của bạn)
const supabaseUrl = 'https://srajbfixapsjnmsdldve.supabase.co';
const supabaseKey = 'sb_publishable_aUPBpRiK4YfjgB7JYw_WSQ_GZd-zSrp';
const supabaseClient = supabase.createClient(supabaseUrl, supabaseKey);

// --- PHẦN 1: LOGIC CHO TRANG CHỦ (Danh sách) ---
async function fetchEvents() {
    const listElement = document.getElementById('event-list');
    if (!listElement) return; // Nếu không tìm thấy list thì thoát (đang ở trang chi tiết)

    const { data, error } = await supabaseClient
        .from('events')
        .select('*')
        .order('id', { ascending: false });

    if (error) {
        listElement.innerHTML = '<p>Lỗi kết nối.</p>';
        return;
    }

    listElement.innerHTML = '';
    data.forEach(event => {
        const card = document.createElement('div');
        card.className = 'event-card';
        // Thêm sự kiện click để chuyển trang
        card.onclick = () => {
            window.location.href = `event.html?id=${event.id}`;
        };
        
        card.innerHTML = `
            <div class="event-date">${event.date_range || ''}</div>
            <div class="event-title">${event.title || ''}</div>
            <div class="event-loc">${event.location || ''}</div>
            <div class="event-status">${event.status || ''}</div>
        `;
        listElement.appendChild(card);
    });
}

// --- PHẦN 2: LOGIC CHO TRANG CHI TIẾT (event.html) ---
async function fetchEventDetail() {
    const container = document.getElementById('event-detail-container');
    if (!container) return; // Nếu không tìm thấy container thì thoát (đang ở trang chủ)

    // Lấy ID từ trên thanh địa chỉ (URL)
    const urlParams = new URLSearchParams(window.location.search);
    const eventId = urlParams.get('id');

    if (!eventId) {
        container.innerHTML = '<p>Không tìm thấy sự kiện.</p>';
        return;
    }

    // Gọi database lấy đúng sự kiện đó
    const { data: event, error } = await supabaseClient
        .from('events')
        .select('*')
        .eq('id', eventId)
        .single();

    if (error || !event) {
        container.innerHTML = '<p>Sự kiện không tồn tại hoặc đã bị xóa.</p>';
        return;
    }

    // Hiển thị giao diện chi tiết (Giống ảnh 2, 3)
    // Nếu có ảnh thì hiện ảnh, không thì dùng ảnh mặc định
    const imgSrc = event.image_url ? event.image_url : 'https://via.placeholder.com/800x400?text=No+Image';

    container.innerHTML = `
        <div class="detail-header">
            <img src="${imgSrc}" alt="${event.title}" class="detail-image">
        </div>
        
        <h1 class="detail-title">${event.title}</h1>
        
        <div class="detail-meta">
            <span>📅 ${event.date_range}</span>
            <span style="margin-left: 20px;">📍 ${event.location}</span>
        </div>

        ${event.external_link ? `
            <a href="${event.external_link}" target="_blank" class="btn-detail">
                ↗ Thông tin chi tiết
            </a>
        ` : ''}

        <div class="detail-desc">
            <p>${event.description || 'Chưa có mô tả chi tiết cho sự kiện này.'}</p>
        </div>
    `;
}

// Chạy hàm tương ứng tùy theo đang ở trang nào
document.addEventListener('DOMContentLoaded', () => {
    fetchEvents();       // Chạy ở trang chủ
    fetchEventDetail();  // Chạy ở trang chi tiết
});
