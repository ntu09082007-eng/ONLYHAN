// CẤU HÌNH SUPABASE
const supabaseUrl = 'https://srajbfixapsjnmsdldve.supabase.co'; // Dán URL vào đây
const supabaseKey = 'sb_publishable_aUPBpRiK4YfjgB7JYw_WSQ_GZd-zSrp'; // Dán Anon Key vào đây
const supabase = supabase.createClient(supabaseUrl, supabaseKey);

// Hàm lấy dữ liệu Sự kiện
async function fetchEvents() {
    const listElement = document.getElementById('event-list');
    
    // Gọi database
    const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('id', { ascending: false });

    if (error) {
        console.error('Lỗi tải sự kiện:', error);
        listElement.innerHTML = '<p>Không thể kết nối đến hệ thống dữ liệu.</p>';
        return;
    }

    // Xóa loading và hiển thị dữ liệu
    listElement.innerHTML = '';
    data.forEach(event => {
        const card = document.createElement('div');
        card.className = 'event-card';
        card.innerHTML = `
            <div class="event-date">${event.date_range}</div>
            <div class="event-title">${event.title}</div>
            <div class="event-loc">${event.location}</div>
            <div class="event-status">${event.status}</div>
        `;
        listElement.appendChild(card);
    });
}

// Chạy khi trang tải xong
document.addEventListener('DOMContentLoaded', () => {
    fetchEvents();
});
