// 1. CẤU HÌNH SUPABASE
const supabaseUrl = 'https://srajbfixapsjnmsdldve.supabase.co';
const supabaseKey = 'sb_publishable_aUPBpRiK4YfjgB7JYw_WSQ_GZd-zSrp';
const supabaseClient = supabase.createClient(supabaseUrl, supabaseKey);

// 2. DỮ LIỆU NHẠC (CỤC BỘ)
let allProducts = [];
const musicVideos = [
    {
        id: 'tamlinh',
        title: 'LYHAN - TÂM LINH ALBUM',
        desc: 'Composer: Lê Công Thành | Lyricist: Lê Công Thành | Music Producer: Benjamin James | ...',
        videoId: 'VIDEO_ID_HERE' 
    },
    {
        id: 'harley', 
        title: 'A NEW HARLEY QUINN - LYHAN',
        desc: '"Am I a new Harley Quinn for you? Put me through hell then you called it love?"...',
        videoId: 'VIDEO_ID_HERE'
    },
    {
        id: 'nhandanh',
        title: 'LYHAN - Nhân Danh Tình Yêu',
        desc: 'COMPOSER: LÊ CÔNG THÀNH | LYRIC: ĐINH QUANG MINH, ĐẶNG BẢO ANH, LÊ CÔNG...',
        videoId: 'VIDEO_ID_HERE'
    },
    {
        id: 'welcome',
        title: 'WELCOME HOME - LYHAN | OFFICIAL MUSIC VIDEO',
        desc: 'Sản phẩm âm nhạc đánh dấu sự trở lại đầy cảm xúc...',
        videoId: 'VIDEO_ID_HERE'
    }
];

// 3. DỮ LIỆU ẢNH ALBUM (CỤC BỘ - Mapped by ID)
const albumData = {
    "1": [
        "https://images.unsplash.com/photo-1492684223066-81342ee5ff30",
        "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7",
        "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7",
        "https://images.unsplash.com/photo-1501612780327-45045538702b",
        "https://images.unsplash.com/photo-1470225620780-dba8ba36b745",
        "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4",
        "https://images.unsplash.com/photo-1493225255756-d9584f8606e9",
        "https://images.unsplash.com/photo-1501612780327-45045538702b"
    ],
    "2": [
        "https://images.unsplash.com/photo-1493225255756-d9584f8606e9",
        "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4",
        "https://images.unsplash.com/photo-1501612780327-45045538702b",
        "https://images.unsplash.com/photo-1470225620780-dba8ba36b745",
        "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7",
        "https://images.unsplash.com/photo-1492684223066-81342ee5ff30"
    ],
    "3": [
        "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7",
        "https://images.unsplash.com/photo-1492684223066-81342ee5ff30",
        "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4",
        "https://images.unsplash.com/photo-1493225255756-d9584f8606e9",
        "https://images.unsplash.com/photo-1501612780327-45045538702b",
        "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7"
    ]
};

// =======================================================
// PHẦN A: LOGIC CHO TRANG CHỦ (index.html)
// =======================================================

// A1. Lấy danh sách sự kiện (LỊCH TRÌNH)
async function fetchEvents() {
    const listElement = document.getElementById('event-list');
    if (!listElement) return;

    const { data, error } = await supabaseClient
        .from('events')
        .select('*')
        .order('id', { ascending: false });

    if (error) {
        listElement.innerHTML = '<p>Không thể tải dữ liệu.</p>';
        return;
    }

    listElement.innerHTML = '';
    data.forEach(event => {
        const card = document.createElement('div');
        card.className = 'event-card';
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

// A2. Lấy danh sách nhạc (SẢN PHẨM ÂM NHẠC)
function fetchMusic() {
    // Gán dữ liệu vào biến toàn cục để dùng cho chức năng tìm kiếm
    allProducts = musicVideos; 
    
    // Gọi hàm hiển thị
    renderCarousel(musicVideos);
    renderModalGrid(musicVideos);
}

function renderCarousel(products) {
    const container = document.getElementById('music-carousel');
    if (!container) return;
    
    container.innerHTML = '';
    products.forEach(item => {
        const card = document.createElement('div');
        card.className = 'music-card';
        card.innerHTML = `
            <iframe class="video-embed" 
                src="https://www.youtube.com/embed/${item.videoId}" 
                title="${item.title}" 
                frameborder="0" allowfullscreen>
            </iframe>
            <div class="music-info">
                <div class="music-title">${item.title}</div>
                <div class="music-composer">${item.desc}</div>
            </div>
        `;
        container.appendChild(card);
    });
}

function renderModalGrid(products) {
    const container = document.getElementById('modal-grid');
    if(!container) return;
    
    container.innerHTML = '';
    if(products.length === 0) {
        container.innerHTML = '<p style="color:#888;">Không tìm thấy kết quả.</p>';
        return;
    }
    products.forEach(item => {
        const card = document.createElement('div');
        card.className = 'music-card';
        card.innerHTML = `
            <iframe class="video-embed" 
                src="https://www.youtube.com/embed/${item.videoId}" 
                allowfullscreen>
            </iframe>
            <div class="music-info">
                <div class="music-title" style="font-size:1rem">${item.title}</div>
                <div class="music-composer">${item.desc}</div>
            </div>
        `;
        container.appendChild(card);
    });
}

// A3. Điều khiển Carousel & Modal
window.scrollCarousel = (direction) => {
    const container = document.getElementById('music-carousel');
    if(container) {
        const scrollAmount = container.clientWidth * 0.6;
        container.scrollBy({ left: direction * scrollAmount, behavior: 'smooth' });
    }
};

// === KHỞI TẠO VÀ SỰ KIỆN CHÍNH ===
document.addEventListener('DOMContentLoaded', () => {
    // 1. Logic Modal Nhạc & Tìm kiếm
    const musicModal = document.getElementById('music-modal');
    const btnShowAll = document.getElementById('btn-show-all');
    const searchInput = document.getElementById('search-input');

    if (btnShowAll && musicModal) {
        btnShowAll.onclick = () => { musicModal.style.display = 'flex'; };
        window.closeModal = () => { musicModal.style.display = 'none'; };
    }

    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const keyword = e.target.value.toLowerCase();
            const filtered = allProducts.filter(item => 
                (item.title && item.title.toLowerCase().includes(keyword)) || 
                (item.desc && item.desc.toLowerCase().includes(keyword))
            );
            renderModalGrid(filtered);
        });
    }

    // 2. Logic Thanh cuộn Gallery (Thanh màu)
    const gallery = document.getElementById('photo-gallery'); // Lưu ý: Nếu đã dùng layout mới thì ID này có thể đã đổi
    const galleryWrapper = document.getElementById('mixed-gallery-container'); // Check container mới
    const targetScroll = galleryWrapper || gallery; // Ưu tiên cái mới
    
    const progressLine = document.getElementById('gallery-progress-line');

    if (targetScroll && progressLine) {
        targetScroll.addEventListener('scroll', () => {
            const scrollTop = targetScroll.scrollTop;
            const maxScroll = targetScroll.scrollHeight - targetScroll.clientHeight;
            
            if (maxScroll > 0) {
                const scrollPercent = (scrollTop / maxScroll) * 100;
                progressLine.style.height = `${scrollPercent}%`;
            }
        });
    }

    // 3. Logic ALBUM DETAIL (Khi click vào Gallery Item)
    const galleryItems = document.querySelectorAll('.gallery-item');
    const albumModal = document.getElementById('album-modal');
    const closeAlbumModal = document.getElementById('close-album-modal');
    const albumGrid = document.getElementById('album-grid');

    // 4. Logic Lightbox (Xem ảnh to)
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const closeLightbox = document.getElementById('close-lightbox');

    if (galleryItems.length > 0 && albumModal && albumGrid) {
        galleryItems.forEach(item => {
            item.addEventListener('click', () => {
                const albumId = item.getAttribute('data-album-id');
                // Lấy danh sách ảnh
                let images = albumData[albumId] || albumData["1"];

                // Mở Modal
                albumModal.style.display = 'flex';
                
                // Xóa nội dung cũ
                albumGrid.innerHTML = ''; 
                
                // Render ảnh vào lưới (Grid chuẩn, không chia hàng lẻ)
                images.forEach(src => {
                    const img = document.createElement('img');
                    img.src = src;
                    img.className = 'album-detail-img';
                    
                    // Click ảnh nhỏ -> Mở Lightbox to
                    img.addEventListener('click', (e) => {
                        e.stopPropagation();
                        if (lightbox && lightboxImg) {
                            lightbox.style.display = 'flex';
                            lightboxImg.src = src;
                        }
                    });
                    albumGrid.appendChild(img);
                });
            });
        });

        // Đóng Album Modal
        if (closeAlbumModal) {
            closeAlbumModal.addEventListener('click', () => {
                albumModal.style.display = 'none';
            });
        }
        
        // Đóng khi click ra ngoài
        albumModal.addEventListener('click', (e) => {
            if (e.target === albumModal) {
                albumModal.style.display = 'none';
            }
        });
    }

    // 5. Đóng Lightbox
    if (closeLightbox && lightbox) {
        closeLightbox.addEventListener('click', () => {
            lightbox.style.display = 'none';
        });

        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                lightbox.style.display = 'none';
            }
        });
    }

    // 6. CHẠY CÁC HÀM TẢI DỮ LIỆU (QUAN TRỌNG)
    fetchEvents();      // Tải sự kiện từ Supabase
    fetchMusic();       // Tải nhạc từ biến cục bộ
    fetchEventDetail(); // Tải chi tiết sự kiện (nếu đang ở trang detail)
});

// =======================================================
// PHẦN B: LOGIC CHO TRANG CHI TIẾT (event.html)
// =======================================================

async function fetchEventDetail() {
    const container = document.getElementById('event-detail-container');
    if (!container) return; 

    const urlParams = new URLSearchParams(window.location.search);
    const eventId = urlParams.get('id');

    if (!eventId) {
        container.innerHTML = '<p>Không tìm thấy ID sự kiện.</p>';
        return;
    }

    const { data: event, error } = await supabaseClient
        .from('events')
        .select('*')
        .eq('id', eventId)
        .single();

    if (error || !event) {
        console.error('Lỗi detail:', error);
        container.innerHTML = '<p>Sự kiện không tồn tại hoặc lỗi kết nối.</p>';
        return;
    }

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
