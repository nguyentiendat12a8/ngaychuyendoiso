(() => {
    const panel = document.getElementById('articleAudioPanel');
    const audio = document.getElementById('articleAudio');
    const listen = document.getElementById('articleListenBtn');
    const status = document.getElementById('articleAudioStatus');
    if (!panel || !audio || !listen || !status) return;
    let currentTrack = null;
    let generation = 0;
    function buttonState(state) {
        const label = state === 'playing' ? 'Tạm dừng bản đọc' : state === 'loading' ? 'Đang tải bản đọc' : 'Phát bản đọc bài viết';
        const icon = state === 'playing' ? 'fa-pause' : state === 'loading' ? 'fa-spinner fa-spin' : 'fa-play';
        listen.innerHTML = `<i class="fa-solid ${icon} text-sm" aria-hidden="true"></i>`;
        listen.setAttribute('aria-label', label);
        listen.setAttribute('title', label);
        listen.setAttribute('aria-pressed', String(state === 'playing'));
        listen.setAttribute('aria-busy', String(state === 'loading'));
        listen.disabled = state === 'loading';
    }
    function reset() {
        generation++;
        currentTrack = null;
        audio.pause();
        audio.removeAttribute('src');
        audio.load();
        panel.classList.add('hidden');
        buttonState('paused');
        status.textContent = 'Bản đọc bằng giọng AI. Bấm nút phát để bắt đầu.';
    }
    function setArticle(id) {
        reset();
        currentTrack = window.storyAudioTracks?.[id] || null;
        if (currentTrack) panel.classList.remove('hidden');
    }
    listen.addEventListener('click', async () => {
        if (!currentTrack) return;
        if (!audio.paused && !audio.ended) {
            audio.pause();
            buttonState('paused');
            return;
        }
        const attempt = generation;
        buttonState('loading');
        status.textContent = 'Đang tải bản đọc…';
        if (!audio.getAttribute('src')) audio.src = currentTrack.src;
        if (audio.ended) audio.currentTime = 0;
        audio.playbackRate = 1;
        try {
            await audio.play();
            if (attempt !== generation) return;
            buttonState('playing');
        } catch (error) {
            if (attempt !== generation) return;
            status.textContent = 'Chưa phát được bản đọc. Bấm nút phát để thử lại.';
            buttonState('paused');
            listen.setAttribute('title', status.textContent);
            console.warn('Article audio playback:', error.name);
        }
    });
    audio.addEventListener('playing', () => {
        if (!currentTrack) return;
        buttonState('playing');
        status.textContent = 'Đang đọc bài viết. Bấm nút tạm dừng để dừng đọc.';
    });
    audio.addEventListener('pause', () => {
        if (!currentTrack) return;
        buttonState('paused');
        if (!audio.ended) status.textContent = 'Đã tạm dừng bản đọc.';
    });
    audio.addEventListener('ended', () => {
        if (!currentTrack) return;
        buttonState('paused');
        status.textContent = 'Đã đọc xong. Bấm nút phát để nghe lại.';
    });
    audio.addEventListener('error', () => {
        if (!currentTrack) return;
        status.textContent = 'Không tải được âm thanh. Bấm nút phát để thử lại.';
        buttonState('paused');
        listen.setAttribute('title', status.textContent);
        audio.removeAttribute('src');
        audio.load();
    });
    window.articleNarration = { setArticle, reset };
})();
