document.addEventListener('DOMContentLoaded', function() {
    // Элементы DOM
    const radioButtons = document.querySelectorAll('input[name="trainer-tabs"]');
    const navLinks = document.querySelectorAll('.trainer-nav__link');
    const sections = document.querySelectorAll('.trainer-section');
    
    // Функция для переключения вкладок
    function switchTab(activeRadio) {
        // Убираем активные классы у всех элементов
        navLinks.forEach(link => link.classList.remove('trainer-nav__link--active'));
        sections.forEach(section => section.classList.remove('trainer-section--active'));
        
        // Активируем соответствующую вкладку и раздел
        const targetId = activeRadio.id;
        const targetContentId = targetId.replace('tab-', '') + '-content';
        
        // Находим и активируем ссылку
        const activeLink = document.querySelector(`label[for="${targetId}"]`);
        if (activeLink) {
            activeLink.classList.add('trainer-nav__link--active');
        }
        
        // Находим и активируем раздел
        const activeSection = document.getElementById(targetContentId);
        if (activeSection) {
            activeSection.classList.add('trainer-section--active');
        }
    }
    
    // Обработчик изменения радиокнопок
    radioButtons.forEach(radio => {
        radio.addEventListener('change', function() {
            if (this.checked) {
                switchTab(this);
            }
        });
    });
    
    // Обработчик кликов по ссылкам (на случай, если радиокнопки не сработают)
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetRadioId = this.getAttribute('for');
            const targetRadio = document.getElementById(targetRadioId);
            
            if (targetRadio) {
                targetRadio.checked = true;
                switchTab(targetRadio);
            }
        });
    });
    
    // Активируем первую вкладку по умолчанию
    if (radioButtons.length > 0) {
        radioButtons[0].checked = true;
        switchTab(radioButtons[0]);
    }
});