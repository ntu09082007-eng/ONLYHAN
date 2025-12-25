// CẤU HÌNH SUPABASE (Giữ nguyên của bạn)
const supabaseUrl = 'https://srajbfixapsjnmsdldve.supabase.co';
const supabaseKey = 'sb_publishable_aUPBpRiK4YfjgB7JYw_WSQ_GZd-zSrp';
const supabaseClient = supabase.createClient(supabaseUrl, supabaseKey);

// --- 1. QUẢN LÝ SỰ KIỆN (CODE CŨ GIỮ NGUYÊN) ---
async function fetchEvents() {
    const listElement = document.getElementById('event-list');
    if (!listElement) return;

    const { data, error } = await supabaseClient
        .from('events')
        .select('*')
        .order('id', { ascending: false });

    if (error) { listElement.innerHTML = '<p>Lỗi kết nối.</p>'; return; }

    listElement.innerHTML = '';
    data.forEach(event => {
        const card = document.createElement('div');
        card.className = 'event-card';
        card.onclick = () => { window.location.href = `event.html?id=${event.id}`; };
        card.innerHTML = `
            <div class="event-date">${event.date_range || ''}</div>
            <div class="event-title">${event.title || ''}</div>
            <div class="event-loc">${event.location || ''}</div>
            <div class="event-status">${event.status || ''}</div>
        `;
        listElement.appendChild(card);
    });
}

// --- 2. QUẢN LÝ SẢN PHẨM ÂM NHẠC (CODE MỚI) ---
let allProducts = []; // Biến lưu toàn bộ bài hát để tìm kiếm

async function fetchMusic() {
    // Chỉ chạy nếu đang ở trang chủ
    const carousel = document.getElementById('music-carousel');
    const modalGrid = document.getElementById('modal-grid');
    if (!carousel) return;

    const { data, error } = await supabaseClient
        .from('products')
        .select('*')
        .order('id', { ascending: false }); // Bài mới nhất lên đầu

    if (error) { console.error(error); return; }
    
    allProducts = data; // Lưu dữ liệu vào biến toàn cục
    renderCarousel(data);
    renderModalGrid(data);
}

// Hàm hiển thị Carousel
function renderCarousel(products) {
    const container = document.getElementById('music-carousel');
    container.innerHTML = '';
    
    products.forEach(item => {
        const card = document.createElement('div');
        card.className = 'music-card';
        card.innerHTML = `
            <iframe class="video-embed" 
                src="https://www.youtube.com/embed/${item.youtube_id}" 
                title="${item.title}" frameborder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen>
            </iframe>
            <div class="music-info">
                <div class="music-title">${item.title}</div>
                <div class="music-composer">${item.composer}</div>
            </div>
        `;
        container.appendChild(card);
    });
}

// Hàm hiển thị Lưới trong Modal
function renderModalGrid(products) {
    const container = document.getElementById('modal-grid');
    container.innerHTML = '';

    if(products.length === 0) {
        container.innerHTML = '<p style="color:#888; width:100%">Không tìm thấy kết quả.</p>';
        return;
    }

    products.forEach(item => {
        // Tái sử dụng class music-card nhưng CSS Grid sẽ tự chỉnh layout
        const card = document.createElement('div');
        card.className = 'music-card'; 
        card.style.width = '100%'; // Trong lưới thì full width ô
        card.innerHTML = `
            <iframe class="video-embed" 
                src="https://www.youtube.com/embed/${item.youtube_id}" 
                allowfullscreen>
            </iframe>
            <div class="music-info">
                <div class="music-title" style="font-size:1rem">${item.title}</div>
            </div>
        `;
        container.appendChild(card);
    });
}

// --- 3. CÁC NÚT ĐIỀU KHIỂN & TÌM KIẾM ---

// Nút Next/Prev Carousel
window.scrollCarousel = (direction) => {
    const container = document.getElementById('music-carousel');
    const scrollAmount = container.clientWidth * 0.6; // Trượt 60% chiều rộng
    container.scrollBy({ left: direction * scrollAmount, behavior: 'smooth' });
};

// Mở/Đóng Modal
const modal = document.getElementById('music-modal');
const btnShowAll = document.getElementById('btn-show-all');

if(btnShowAll) {
    btnShowAll.onclick = () => { modal.style.display = 'flex'; };
}
window.closeModal = () => { modal.style.display = 'none'; };

// Tìm kiếm
const searchInput = document.getElementById('search-input');
if(searchInput) {
    searchInput.addEventListener('input', (e) => {
        const keyword = e.target.value.toLowerCase();
        // Lọc dữ liệu
        const filtered = allProducts.filter(item => 
            item.title.toLowerCase().includes(keyword) || 
            item.composer.toLowerCase().includes(keyword)
        );
        renderModalGrid(filtered);
    });
}

// Chạy tất cả khi tải trang
document.addEventListener('DOMContentLoaded', () => {
    fetchEvents();
    fetchMusic();
});

// Logic cho trang chi tiết sự kiện (Giữ nguyên)
async function fetchEventDetail() { /* ... Code cũ của bạn ... */ }
if(document.getElementById('event-detail-container')) fetchEventDetail();
