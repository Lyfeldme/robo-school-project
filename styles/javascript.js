document.addEventListener('DOMContentLoaded', function () {
    const sliderWrapper = document.querySelector('.team__slider-wrapper');
    const slider = document.querySelector('.team__slider');
    const prevButton = document.querySelector('.team__arrow--prev');
    const nextButton = document.querySelector('.team__arrow--next');
    const scrollbarThumb = document.querySelector('.team__scrollbar-thumb');
    const scrollbarTrack = document.querySelector('.team__scrollbar-track');

    if (slider && prevButton && nextButton) {
        const cards = document.querySelectorAll('.team__card');
        const cardWidth = cards[0] ? cards[0].offsetWidth + 40 : 0;
        let currentPosition = 0;

        function getMaxPosition() {
            return slider.scrollWidth - sliderWrapper.clientWidth;
        }

        function updateControls() {
            const maxPosition = getMaxPosition();

            if (maxPosition > 0 && scrollbarThumb && scrollbarTrack) {
                const progress = currentPosition / maxPosition;
                const trackWidth = scrollbarTrack.offsetWidth;
                const thumbWidth = scrollbarThumb.offsetWidth;

                const thumbPosition = progress * (trackWidth - thumbWidth);

                scrollbarThumb.style.left = thumbPosition + 'px';
            }
        }

        function scrollToPosition(position) {
            currentPosition = position;
            sliderWrapper.scrollTo({
                left: position,
                behavior: 'smooth'
            });
        }

        prevButton.addEventListener('click', function () {
            const maxPosition = getMaxPosition();
            let newPosition = currentPosition - cardWidth;

            if (newPosition < 0) {
                newPosition = maxPosition;
            }
            scrollToPosition(newPosition);
        });

        nextButton.addEventListener('click', function () {
            const maxPosition = getMaxPosition();
            let newPosition = currentPosition + cardWidth;

            if (newPosition > maxPosition) {
                newPosition = 0;
            }
            scrollToPosition(newPosition);
        });

        sliderWrapper.addEventListener('scroll', function () {
            currentPosition = sliderWrapper.scrollLeft;
            updateControls();
        });

        if (scrollbarTrack) {
            scrollbarTrack.addEventListener('click', function (e) {
                const trackRect = scrollbarTrack.getBoundingClientRect();
                const clickX = e.clientX - trackRect.left;
                const trackWidth = trackRect.width;
                const maxPosition = getMaxPosition();
                const thumbWidth = scrollbarThumb.offsetWidth;

                const progress = Math.max(0, Math.min(1, clickX / trackWidth));
                const newPosition = progress * maxPosition;

                scrollToPosition(newPosition);
            });
        }

        window.addEventListener('resize', updateControls);
        updateControls();
    }

    const phoneInput = document.getElementById('phone');
    if (phoneInput) {
        phoneInput.removeAttribute('pattern');
        phoneInput.removeAttribute('title');

        let isFirstFocus = true;

        phoneInput.addEventListener('focus', function () {
            if (isFirstFocus && (!this.value || this.value === '')) {
                this.value = '+7 (';
                isFirstFocus = false;

                setTimeout(() => {
                    this.setSelectionRange(4, 4);
                }, 0);
            }
        });

        phoneInput.addEventListener('input', function (e) {
            let value = e.target.value;

            if (isFirstFocus && /^\d+$/.test(value)) {
                value = '+7 (' + value;
                isFirstFocus = false;
            }

            const cursorPosition = e.target.selectionStart;
            let cleanValue = value.replace(/[^\d+()\-\s]/g, '');

            if (!cleanValue.startsWith('+7') && cleanValue.length > 0) {
                if (/^\d/.test(cleanValue)) {
                    cleanValue = '+7 (' + cleanValue;
                } else {
                    cleanValue = '+7 (' + cleanValue;
                }
            }

            let numbers = cleanValue.replace(/\D/g, '');
            if (numbers.startsWith('7')) {
                numbers = numbers.substring(1);
            }

            let formattedValue = '+7 (';

            if (numbers.length > 0) {
                formattedValue += numbers.substring(0, 3);
            }
            if (numbers.length > 3) {
                formattedValue += ') ' + numbers.substring(3, 6);
            }
            if (numbers.length > 6) {
                formattedValue += '-' + numbers.substring(6, 8);
            }
            if (numbers.length > 8) {
                formattedValue += '-' + numbers.substring(8, 10);
            }

            e.target.value = formattedValue;

            let newCursorPosition = cursorPosition;
            if (cursorPosition < formattedValue.length && formattedValue[cursorPosition] === '_') {
                newCursorPosition = cursorPosition;
            } else {
                for (let i = cursorPosition; i < formattedValue.length; i++) {
                    if (formattedValue[i] === '_' || i === formattedValue.length - 1) {
                        newCursorPosition = i;
                        break;
                    }
                }
            }

            e.target.setSelectionRange(newCursorPosition, newCursorPosition);
        });

        phoneInput.addEventListener('blur', function () {
            let numbers = this.value.replace(/\D/g, '');

            if (numbers.startsWith('7')) {
                numbers = numbers.substring(1);
            }

            if (numbers.length < 4 && this.value === '+7 (') {
                this.value = '';
                isFirstFocus = true;
            }
        });

        phoneInput.addEventListener('keydown', function (e) {
            if ([
                    'Backspace', 'Delete', 'ArrowLeft', 'ArrowRight',
                    'ArrowUp', 'ArrowDown', 'Tab', 'Home', 'End',
                    'Enter', 'Escape'
                ].includes(e.key)) {
                return;
            }

            if (/[\d+()\-\s]/.test(e.key)) {
                return;
            }

            if (e.key.length === 1) {
                e.preventDefault();
            }
        });

        if (!phoneInput.value) {
            phoneInput.value = '';
        }
    }


    function closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            if (window.location.hash === `#${modalId}`) {
                history.replaceState(null, null, window.location.pathname + window.location.search);
            }

            modal.style.opacity = '0';
            modal.style.visibility = 'hidden';
            modal.style.pointerEvents = 'none';

            document.body.style.overflow = 'auto';
            document.body.style.paddingRight = '';

            console.log(`Модальное окно ${modalId} закрыто`);
        }
    }


    function createMobileSelectForModals() {
        if (window.innerWidth > 320) return;

        document.querySelectorAll('.modal').forEach(modal => {
            if (modal.querySelector('.nav-select-container')) return;

            const navList = modal.querySelector('.trainer-nav__list');
            if (!navList) return;

            const navLinks = navList.querySelectorAll('.trainer-nav__link');
            const navItems = [];

            let activeIndex = 0;
            const radioButtons = modal.querySelectorAll('input[type="radio"][name^="trainer-tabs"]');
            radioButtons.forEach((radio, index) => {
                if (radio.checked) activeIndex = index;
            });

            navLinks.forEach((link, index) => {
                navItems.push({
                    text: link.textContent.trim(),
                    for: link.getAttribute('for'),
                    isActive: index === activeIndex,
                    index: index
                });
            });

            if (navItems.length === 0) return;

            const activeItem = navItems[activeIndex] || navItems[0];

            const selectHTML = `
          <div class="nav-select-container">
            <div class="nav-select-trigger">${activeItem.text}</div>
            <div class="nav-select-dropdown">
              ${navItems.map((item) => `
                <div class="nav-select-item ${item.isActive ? 'active' : ''}" 
                     data-index="${item.index}" 
                     data-for="${item.for}">
                  ${item.text}
                </div>
              `).join('')}
            </div>
          </div>
        `;

            navList.insertAdjacentHTML('beforebegin', selectHTML);

            navList.style.display = 'none';
        });
    }

    function initMobileSelectHandlers() {
        if (window.innerWidth > 320) return;

        document.addEventListener('click', function (e) {
            const selects = document.querySelectorAll('.nav-select-container');
            selects.forEach(select => {
                if (!select.contains(e.target)) {
                    select.classList.remove('active');
                }
            });
        });

        document.querySelectorAll('.nav-select-trigger').forEach(trigger => {
            trigger.addEventListener('click', function (e) {
                e.stopPropagation();
                const container = this.closest('.nav-select-container');
                container.classList.toggle('active');
            });
        });

        document.querySelectorAll('.nav-select-item').forEach(item => {
            item.addEventListener('click', function () {
                const container = this.closest('.nav-select-container');
                const trigger = container.querySelector('.nav-select-trigger');
                const modal = container.closest('.modal');
                const targetIndex = parseInt(this.getAttribute('data-index'));
                const targetFor = this.getAttribute('data-for');

                trigger.textContent = this.textContent;

                container.querySelectorAll('.nav-select-item').forEach(el => {
                    el.classList.remove('active');
                });

                this.classList.add('active');

                container.classList.remove('active');

                if (modal) {
                    const navLinks = modal.querySelectorAll('.trainer-nav__link');
                    const sections = modal.querySelectorAll('.trainer-section');
                    const radioButtons = modal.querySelectorAll('input[type="radio"][name^="trainer-tabs"]');

                    navLinks.forEach(link => {
                        link.classList.remove('trainer-nav__link--active');
                    });
                    sections.forEach(section => {
                        section.classList.remove('trainer-section--active');
                        section.style.display = 'none';
                    });

                    if (navLinks[targetIndex]) {
                        navLinks[targetIndex].classList.add('trainer-nav__link--active');
                    }
                    if (sections[targetIndex]) {
                        sections[targetIndex].classList.add('trainer-section--active');
                        sections[targetIndex].style.display = 'block';

                        setTimeout(() => {
                            const scrollContent = modal.querySelector('.trainer-scroll-content');
                            if (scrollContent) {
                                scrollContent.scrollTop = 0;

                                scrollContent.style.overflowY = 'hidden';
                                setTimeout(() => {
                                    scrollContent.style.overflowY = 'auto';
                                }, 10);
                            }
                        }, 50);
                    }
                    if (radioButtons[targetIndex]) {
                        radioButtons[targetIndex].checked = true;
                    }
                }
            });
        });
    }

    function openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            document.querySelectorAll('.modal').forEach(otherModal => {
                if (otherModal.id !== modalId && getComputedStyle(otherModal).visibility === 'visible') {
                    closeModal(otherModal.id);
                }
            });

            modal.style.opacity = '1';
            modal.style.visibility = 'visible';
            modal.style.pointerEvents = 'all';

            document.body.style.overflow = 'hidden';

            history.pushState(null, null, `#${modalId}`);

            setTimeout(() => {
                initModalTabs(modalId);
                initScrollbarForModal(modalId);

                if (window.innerWidth <= 320) {
                    const oldSelect = modal.querySelector('.nav-select-container');
                    if (oldSelect) {
                        oldSelect.remove();
                    }
                    const navList = modal.querySelector('.trainer-nav__list');
                    if (navList) {
                        navList.style.display = '';
                    }

                    createMobileSelectForModals();
                    initMobileSelectHandlers();
                }
            }, 50);

            console.log(`Модальное окно ${modalId} открыто`);
        }
    }

    function initScrollbarForModal(modalId) {
        const modal = document.getElementById(modalId);
        if (!modal) return;

        const scrollContent = modal.querySelector('.trainer-scroll-content');
        const scrollThumb = modal.querySelector('.custom-scroll-thumb');
        const scrollBar = modal.querySelector('.custom-scrollbar');

        if (!scrollContent || !scrollThumb || !scrollBar) return;

        let isDragging = false;
        let startY, startScrollTop;
        const FIXED_THUMB_HEIGHT = 175;

        function updateScrollThumb() {
            const scrollTop = scrollContent.scrollTop;
            const scrollHeight = scrollContent.scrollHeight;
            const clientHeight = scrollContent.clientHeight;
            const trackHeight = scrollBar.offsetHeight;

            if (scrollHeight > clientHeight) {
                scrollBar.style.opacity = '1';

                const maxScroll = scrollHeight - clientHeight;
                let thumbTop = 0;

                if (maxScroll > 0) {
                    const availableSpace = trackHeight - FIXED_THUMB_HEIGHT;
                    thumbTop = (scrollTop / maxScroll) * availableSpace;
                    thumbTop = Math.max(0, Math.min(thumbTop, availableSpace));
                }

                scrollThumb.style.top = thumbTop + 'px';
                scrollThumb.style.height = FIXED_THUMB_HEIGHT + 'px';
            } else {
                scrollBar.style.opacity = '0';
            }
        }

        scrollBar.addEventListener('click', function (e) {
            if (isDragging) return;

            const rect = scrollBar.getBoundingClientRect();
            const clickY = e.clientY - rect.top;

            const scrollHeight = scrollContent.scrollHeight;
            const clientHeight = scrollContent.clientHeight;
            const trackHeight = scrollBar.offsetHeight;
            const maxScroll = scrollHeight - clientHeight;

            if (maxScroll > 0) {
                const availableSpace = trackHeight - FIXED_THUMB_HEIGHT;
                let thumbTop = clickY - (FIXED_THUMB_HEIGHT / 2);
                thumbTop = Math.max(0, Math.min(thumbTop, availableSpace));

                const scrollTop = (thumbTop / availableSpace) * maxScroll;
                scrollContent.scrollTop = Math.max(0, Math.min(scrollTop, maxScroll));
            }
        });

        scrollThumb.addEventListener('mousedown', function (e) {
            e.preventDefault();
            e.stopPropagation();

            isDragging = true;
            startY = e.clientY;
            startScrollTop = scrollContent.scrollTop;

            scrollThumb.classList.add('dragging');

            function onMouseMove(e) {
                if (!isDragging) return;

                const deltaY = e.clientY - startY;
                const trackHeight = scrollBar.offsetHeight;
                const scrollHeight = scrollContent.scrollHeight;
                const clientHeight = scrollContent.clientHeight;
                const maxScroll = scrollHeight - clientHeight;

                const availableSpace = trackHeight - FIXED_THUMB_HEIGHT;
                if (availableSpace > 0) {
                    const scrollRatio = deltaY / availableSpace;
                    const newScrollTop = startScrollTop + (scrollRatio * maxScroll);

                    scrollContent.scrollTop = Math.max(0, Math.min(newScrollTop, maxScroll));
                    updateScrollThumb();
                }
            }

            function onMouseUp() {
                isDragging = false;
                scrollThumb.classList.remove('dragging');
                document.removeEventListener('mousemove', onMouseMove);
                document.removeEventListener('mouseup', onMouseUp);
            }

            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
        });

        scrollContent.addEventListener('scroll', updateScrollThumb);
        window.addEventListener('resize', updateScrollThumb);

        setTimeout(updateScrollThumb, 100);

        return updateScrollThumb;
    }

    function initModalTabs(modalId) {
        const modal = document.getElementById(modalId);
        if (!modal) return;

        const radioButtons = modal.querySelectorAll('input[type="radio"][name^="trainer-tabs"]');
        const navLinks = modal.querySelectorAll('.trainer-nav__link');
        const sections = modal.querySelectorAll('.trainer-section');

        console.log(`Инициализация вкладок для ${modalId}:`, {
            radios: radioButtons.length,
            links: navLinks.length,
            sections: sections.length
        });

        if (!radioButtons.length || !navLinks.length || !sections.length) {
            console.warn(`Не найдены элементы вкладок для ${modalId}`);
            return;
        }

        function switchTab(activeRadio) {
            console.log('Переключение на вкладку:', activeRadio.id);

            sections.forEach(section => {
                section.classList.remove('trainer-section--active');
                section.style.display = 'none';
            });

            navLinks.forEach(link => {
                link.classList.remove('trainer-nav__link--active');
            });

            const targetId = activeRadio.id;
            const targetContentId = targetId.replace('tab-', '') + '-content';

            const activeLink = modal.querySelector(`label[for="${targetId}"]`);
            if (activeLink) {
                activeLink.classList.add('trainer-nav__link--active');
            }

            const activeSection = modal.querySelector(`#${targetContentId}`);
            if (activeSection) {
                activeSection.classList.add('trainer-section--active');
                activeSection.style.display = 'block';

                setTimeout(() => {
                    activeSection.style.opacity = '1';
                    activeSection.style.visibility = 'visible';
                }, 10);
            }

            const scrollContent = modal.querySelector('.trainer-scroll-content');
            if (scrollContent) {
                setTimeout(() => {
                    scrollContent.scrollTop = 0;

                    const scrollThumb = modal.querySelector('.custom-scroll-thumb');
                    if (scrollThumb) {
                        setTimeout(() => {
                            const updateFn = window[`updateScrollThumb_${modalId}`];
                            if (typeof updateFn === 'function') {
                                updateFn();
                            }
                        }, 50);
                    }
                }, 20);
            }
        }

        radioButtons.forEach(radio => {
            radio.replaceWith(radio.cloneNode(true));

            const newRadio = modal.querySelector(`#${radio.id}`);
            if (newRadio) {
                newRadio.addEventListener('change', function () {
                    if (this.checked) {
                        switchTab(this);
                    }
                });
            }
        });

        navLinks.forEach(link => {
            link.addEventListener('click', function (e) {
                e.preventDefault();
                e.stopPropagation();

                const targetRadioId = this.getAttribute('for');
                if (!targetRadioId) return;

                const targetRadio = modal.querySelector(`#${targetRadioId}`);
                if (targetRadio) {
                    targetRadio.checked = true;
                    targetRadio.dispatchEvent(new Event('change', {
                        bubbles: true
                    }));
                }
            });
        });

        const firstRadio = radioButtons[0];
        if (firstRadio) {
            firstRadio.checked = true;
            setTimeout(() => switchTab(firstRadio), 10);
        }
    }


    document.querySelectorAll('.modal__close').forEach(closeBtn => {
        closeBtn.addEventListener('click', function (e) {
            e.preventDefault();
            const modal = this.closest('.modal');
            if (modal && modal.id) {
                closeModal(modal.id);
            }
        });
    });

    document.querySelectorAll('.modal__overlay').forEach(overlay => {
        overlay.addEventListener('click', function (e) {
            if (e.target === this) {
                const modal = this.closest('.modal');
                if (modal && modal.id) {
                    closeModal(modal.id);
                }
            }
        });
    });

    document.querySelectorAll('a[href^="#modal-"]').forEach(button => {
        button.addEventListener('click', function (e) {
            e.preventDefault();
            const modalId = this.getAttribute('href').substring(1);
            if (modalId) {
                openModal(modalId);
            }
        });
    });

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
            document.querySelectorAll('.modal').forEach(modal => {
                if (modal.id && getComputedStyle(modal).visibility === 'visible') {
                    closeModal(modal.id);
                }
            });
        }
    });

    window.addEventListener('hashchange', function () {
        const hash = window.location.hash.substring(1);

        if (hash && hash.startsWith('modal-')) {
            document.querySelectorAll('.modal').forEach(modal => {
                if (modal.id !== hash && getComputedStyle(modal).visibility === 'visible') {
                    closeModal(modal.id);
                }
            });

            setTimeout(() => openModal(hash), 10);
        } else {
            document.querySelectorAll('.modal').forEach(modal => {
                if (getComputedStyle(modal).visibility === 'visible') {
                    closeModal(modal.id);
                }
            });
        }
    });

    const initialHash = window.location.hash.substring(1);
    if (initialHash && initialHash.startsWith('modal-')) {
        setTimeout(() => openModal(initialHash), 100);
    }

    function initAllModals() {
        document.querySelectorAll('.modal').forEach(modal => {
            if (modal.id) {
                const updateFn = initScrollbarForModal(modal.id);
                if (updateFn) {
                    window[`updateScrollThumb_${modal.id}`] = updateFn;
                }

                setTimeout(() => initModalTabs(modal.id), 50);

                if (window.innerWidth <= 320) {
                    const oldSelect = modal.querySelector('.nav-select-container');
                    if (oldSelect) {
                        oldSelect.remove();
                    }
                    const navList = modal.querySelector('.trainer-nav__list');
                    if (navList) {
                        navList.style.display = '';
                    }

                    createMobileSelectForModals();
                    initMobileSelectHandlers();
                }
            }
        });
    }

    window.addEventListener('resize', function () {
        if (window.innerWidth <= 320) {
            setTimeout(() => {
                createMobileSelectForModals();
                initMobileSelectHandlers();
            }, 100);
        } else {
            document.querySelectorAll('.nav-select-container').forEach(select => {
                select.remove();
            });
            document.querySelectorAll('.trainer-nav__list').forEach(list => {
                list.style.display = '';
            });
        }
    });

    setTimeout(initAllModals, 200);

    const burgerButton = document.querySelector('.burger-menu');
    const headerMenu = document.querySelector('.header__menu');
    const headerContact = document.querySelector('.header__contact');
    const body = document.body;

    if (burgerButton && headerMenu) {
        burgerButton.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();

            this.classList.toggle('active');
            headerMenu.classList.toggle('mobile-open');

            if (headerContact) {
                headerContact.classList.toggle('mobile-visible');
            }

            if (this.classList.contains('active')) {
                body.classList.add('menu-open');
                body.style.overflow = 'hidden';
            } else {
                body.classList.remove('menu-open');
                body.style.overflow = '';
            }
        });

        const menuLinks = headerMenu.querySelectorAll('a');
        menuLinks.forEach(link => {
            link.addEventListener('click', function () {
                burgerButton.classList.remove('active');
                headerMenu.classList.remove('mobile-open');
                if (headerContact) headerContact.classList.remove('mobile-visible');
                body.classList.remove('menu-open');
                body.style.overflow = '';
            });
        });

        document.addEventListener('click', function (e) {
            if (burgerButton.classList.contains('active') &&
                !headerMenu.contains(e.target) &&
                !burgerButton.contains(e.target)) {

                burgerButton.classList.remove('active');
                headerMenu.classList.remove('mobile-open');
                if (headerContact) headerContact.classList.remove('mobile-visible');
                body.classList.remove('menu-open');
                body.style.overflow = '';
            }
        });

        window.addEventListener('resize', function () {
            if (window.innerWidth > 768) {
                burgerButton.classList.remove('active');
                headerMenu.classList.remove('mobile-open');
                if (headerContact) headerContact.classList.remove('mobile-visible');
                body.classList.remove('menu-open');
                body.style.overflow = '';
            }
        });
    }

    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', function (e) {
            const href = this.getAttribute('href');

            if (href.startsWith('#modal-')) return;

            if (href === '#' || href === '#top') {
                e.preventDefault();
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
                return;
            }

            if (href === '#form-section') {
                e.preventDefault();
                const formSection = document.getElementById('form-section');
                if (formSection) {
                    formSection.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
                return;
            }

            if (href !== '') {
                e.preventDefault();
                const targetId = href.substring(1);
                const targetElement = document.getElementById(targetId);
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });

    const formSubmitButton = document.querySelector('.form__button');
    if (formSubmitButton) {
        formSubmitButton.addEventListener('click', function (e) {
            e.preventDefault();

            const nameInput = document.getElementById('name');
            const phoneInput = document.getElementById('phone');
            const emailInput = document.getElementById('email');

            let isValid = true;

            if (nameInput && nameInput.value.trim().length < 2) {
                isValid = false;
                nameInput.style.borderColor = '#e74c3c';
            } else if (nameInput) {
                nameInput.style.borderColor = '#2ecc71';
            }

            if (phoneInput) {
                const phoneNumbers = phoneInput.value.replace(/\D/g, '');
                if (phoneNumbers.length < 11) {
                    isValid = false;
                    phoneInput.style.borderColor = '#e74c3c';
                } else {
                    phoneInput.style.borderColor = '#2ecc71';
                }
            }

            if (isValid) {
                console.log('Форма отправлена:', {
                    name: nameInput ? nameInput.value : '',
                    phone: phoneInput ? phoneInput.value : '',
                    email: emailInput ? emailInput.value : ''
                });

                alert('Спасибо! Ваша заявка отправлена.');

                if (nameInput) nameInput.value = '';
                if (phoneInput) phoneInput.value = '';
                if (emailInput) emailInput.value = '';

                document.querySelectorAll('.form__input').forEach(input => {
                    input.style.borderColor = '';
                });
            } else {
                alert('Пожалуйста, заполните все обязательные поля правильно.');
            }
        });
    }

    document.querySelectorAll('.tarif__button').forEach(button => {
        button.addEventListener('click', function (e) {
            e.preventDefault();

            const formSection = document.getElementById('form-section');
            if (formSection) {
                formSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });

                setTimeout(() => {
                    const nameInput = document.getElementById('name');
                    if (nameInput) {
                        nameInput.focus();
                    }
                }, 500);
            }
        });
    });

    console.log('Все скрипты успешно инициализированы!');
});