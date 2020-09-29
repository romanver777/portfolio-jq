"use strict";

$(function () {
  //прелоадер
  function getBgImageUrl(elClassName) {
    var url = $(".".concat(elClassName)).css('background-image'),
        ind = url.indexOf('style');
    return url.substring(ind, url.length - 2);
  }

  function loadFilePromise(url, type) {
    return new Promise(function (resolve, reject) {
      var file = {};

      if (type == 'img') {
        file = new Image();
        file.src = url;
      }

      if (type == 'script') {
        file = document.createElement('script');
        file.src = url;
        file.async = false;
        document.body.appendChild(file);
      }

      file.addEventListener('load', function () {
        resolve();
      });
      file.addEventListener('error', function () {
        reject();
      });
    });
  }

  function isLoadedFonts(fonts) {
    var fontsArray = ['RobotoMedium', 'RobotoRegular', 'RobotoLight', 'RobotoLightItalic', 'RobotoBold', 'RobotoBoldItalic', 'SansusWebissimo'];
    var obj = {},
        promiseArr = [],
        timeout = 4000;
    fonts.forEach(function (font) {
      var fontLowerCase = font.toLowerCase();
      obj[fontLowerCase] = new FontFaceObserver(font);
    });

    for (var key in obj) {
      if (obj.hasOwnProperty(key)) {
        promiseArr.push(obj[key].load(null));
      }
    }

    var robotomedium = new FontFaceObserver('RobotoMedium'),
        robotoregular = new FontFaceObserver('RobotoRegular');
    Promise.all([robotomedium.load(null, timeout), robotoregular.load(null, timeout)]).then(function () {
      return true;
    });
  }

  function loadWelcomePage() {
    // проверка на переданный параметр для окна авторизации
    if (location.toString().indexOf('auth') !== -1) {
      $('.auth__link').hide();
      $("#flipbox").toggleClass("flipped");
    }

    $('.container-index').css({
      'display': 'flex'
    });
  }

  function loadOtherPages() {
    $('.main').fadeIn('slow');
    $('.slider').length ? updateSliderSize() : null; //  задать ширину слайдера

    $('#map').length ? setMapParams() : null; //  задать ширину карты
  } // установка высоты главного окна на мобильной версии


  function setMobileFullBodyHeight(elem, page) {
    if (!$(elem).hasClass('wrap__header_blog')) {
      $(elem).height($(window).innerHeight() + 'px');

      if (page === 'firstPage') {
        document.querySelector(elem).style.position = 'fixed';
      }
    }
  }

  function removeLoader() {
    $('#svg_loader').fadeOut('slow');
    $('.preloader').addClass('hided');
  }

  function isMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || 'ontouchstart' in document.documentElement;
  }

  function showPage() {
    if (!isMobile()) {
      if ($('.container-index').length) {
        var scriptUrl = './js/water.min.js',
            mainImage_url_1800 = './style/img/content/bg_forest_1800.jpg',
            mapImage_url = './style/img/content/water-maps.jpg';
        loadFilePromise(scriptUrl, 'script').then(function () {
          return loadFilePromise(mapImage_url, 'img');
        }).then(function () {
          return loadFilePromise(mainImage_url_1800, 'img');
        }).then(function () {
          setTimeout(function () {
            loadWelcomePage();
            removeLoader();
          }, 500);
        }).catch(function () {
          console.log('something wrong');
        });
      } else {
        loadFilePromise(getBgImageUrl('bg-forest-index'), 'img').then(function () {
          if ($('.wrap-comments').length) {
            return loadFilePromise(getBgImageUrl('wrap-comments'), 'img');
          }
        }).then(function () {
          setTimeout(function () {
            loadOtherPages();
            removeLoader();
          }, 500);
        }).catch(function () {
          console.log('something wrong');
        });
      }
    } else {
      if ($('.container-index').length) {
        $('.container-index').addClass('bg-forest-index').addClass('bg-size-cover');
        loadFilePromise(getBgImageUrl('bg-forest-index'), 'img').then(function () {
          setTimeout(function () {
            loadWelcomePage();
            setMobileFullBodyHeight('body', 'firstPage');
            removeLoader();
          }, 500);
        }).catch(function () {
          console.log('something wrong');
        });
      } else {
        loadFilePromise(getBgImageUrl('bg-forest-index'), 'img').then(function () {
          if ($('.wrap-comments').length) {
            return loadFilePromise(getBgImageUrl('wrap-comments'), 'img');
          }
        }).then(function () {
          setTimeout(function () {
            loadOtherPages();
            setMobileFullBodyHeight('.bg-forest-index', 'otherPages');
            removeLoader();
          }, 500);
        }).catch(function () {
          console.log('something wrong');
        });
      }
    }
  } //прелоадер конец
  // flipbox


  (function () {
    $('.auth__link').click(function (e) {
      e.preventDefault();
      $(this).hide();
      $("#flipbox").toggleClass("flipped");
    });
    $('.butt__link_home').click(function (e) {
      e.preventDefault();
      $('.auth__link').show();
      $("#flipbox").toggleClass("flipped");
    });
  })(); // flipbox end
  // скролл к блоку за header


  (function () {
    $('.arrow-down__link').click(function (e) {
      return scrollOneScreen(e);
    });
    $('.arrow-up__link').click(function (e) {
      return scrollOneScreen(e);
    });

    function scrollOneScreen(e) {
      e.preventDefault();
      var headerHeight = $(window).height();
      $('body, html').animate({
        'scrollTop': headerHeight
      }, 1000);
    }
  })(); // анимация меню блога


  (function () {
    var menuBlog = $('.blog-left');

    if (menuBlog.length) {
      if ($('.blog').offset().top <= 0) {
        $('.blog-left__link').show();
      } else {
        $('.blog-left__link').hide();
      }

      $('.blog-left__link').click(function (e) {
        e.preventDefault();
        e.stopPropagation();

        if (!menuBlog.hasClass('opened')) {
          menuBlog.toggleClass('opened');
          menuBlog.removeClass('closed');
        } else {
          menuBlog.toggleClass('opened');
          menuBlog.toggleClass('closed');
        }
      });
      $('.blog__nav').click(function (e) {
        e.preventDefault();
        e.stopPropagation();

        if (menuBlog.hasClass('opened')) {
          menuBlog.toggleClass('opened');
          menuBlog.toggleClass('closed');
        }
      });
    }
  })(); // навигация по статьям


  (function () {
    $(".blog__list a").click(function (e) {
      e.preventDefault();
      e.stopPropagation();
      var topIndent = 15,
          elem = $(e.target).attr('href').slice(1),
          posEl = $("#".concat(elem)).offset().top - topIndent;
      $("body, html").animate({
        'scrollTop': posEl
      }, 1000);
    });
  })(); // фиксация меню блога при перезагрузке на середине страницы


  (function () {
    if ($('.blog').length && $(window).scrollTop() > $('.blog__nav').offset().top) {
      $('.blog__list').addClass('blog_fixed');
    }
  })(); // событие по скролу для меню блога


  $(window).scroll(function () {
    // фиксация меню в блоге
    var blogList = $('.blog__list');

    if (blogList.length) {
      var wScroll = $(window).scrollTop(),
          sideBar = $('.blog__nav'),
          offset = sideBar.offset(),
          stikyStart = offset.top;

      if (wScroll + 25 >= stikyStart) {
        blogList.addClass('blog_fixed');
        blogList.removeClass('blog_relative');
      } else {
        blogList.removeClass('blog_fixed');
        blogList.addClass('blog_relative');
      } // подсвечивание активной ссылки для статьи


      $('.article').each(function (i, elem) {
        var navItems = $('.blog__item a');

        if (isView(elem) > 0 && isView(elem) < 150) {
          var artId = '#' + $(elem).attr('id');
          navItems.each(function (i, el) {
            var navHref = $(el).attr('href');
            $(el).removeClass('blog__link_act');

            if (navHref == artId) {
              $('[href="' + navHref + '"]').addClass('blog__link_act');
            }
          });
        }
      });
    }
  }); // возврат расстояния от элемента до верхнего края окна

  function isView(elem) {
    return elem.getBoundingClientRect().top;
  } // анимация skills


  (function () {
    $(window).on('scroll', function () {
      if ($('.about__skills').length) {
        var heightToTop = $('.about__skills').offset().top - $(window).scrollTop(),
            arraySkills = [50, 38, 80, 24, 16, 55, 18, 60, 25, 47],
            timeOut = 0;

        if (heightToTop < 50) {
          $('.circles__sector').each(function (index, value) {
            setTimeout(function () {
              $(value).css({
                'stroke-dashoffset': "".concat(282.6 / 100 * arraySkills[index])
              });
            }, timeOut + index * 100);
          });
        }
      }
    });
  })(); // slider
  // старт


  (function () {
    $('.control-down__link').click(function (e) {
      e.preventDefault();
      e.stopPropagation();
      startSlide('backward');
    });
    $('.control-up__link').click(function (e) {
      e.preventDefault();
      e.stopPropagation();
      startSlide('forward');
    });
  })(); // запуск слайдера в зависимости от направления


  function startSlide(route) {
    var slideWidth = $('.slider__pict').width();
    var sliderWr = $('.pict__wr');
    var cardsWr = $('.p-card-wr');
    var controlHeight = $('.slider__control').height();
    var controlUpWrap = $('.control-up__wr');
    var controlDownWrap = $('.control-down__wr');
    var scrollSliderWidth = sliderWr.position().left - slideWidth;
    var scrollControlHeight = controlUpWrap.position().top - controlHeight;

    switch (route) {
      case 'forward':
        {
          // клик на кнопку вверх
          // крутим слайд с перемещением первого эл-та в конец набора
          sliderWr.animate({
            left: scrollSliderWidth
          }, 800, function () {
            sliderWr.find('.pict__item:first').appendTo(sliderWr).parent().css({
              'left': 0
            });
          }); // слайдер кнопки вверх

          controlUpWrap.animate({
            top: scrollControlHeight
          }, 800, function () {
            controlUpWrap.find('.control-up__item:first').appendTo(controlUpWrap).parent().css({
              'top': 0
            });
          }); // слайдер кнопки вниз при клике вверх

          controlDownWrap.animate({
            top: scrollControlHeight
          }, 800, function () {
            controlDownWrap.find('.control-down__item:first').appendTo(controlDownWrap).parent().css({
              'top': 0
            });
          }); // слайдер колонки описания

          cardsWr.find('.p-card:first').fadeOut(300);
          cardsWr.find('.p-card:first').removeClass('p-card_active').appendTo(cardsWr);
          cardsWr.find('.p-card:first').delay(300).fadeIn(200);
        }
        break;

      case 'backward':
        {
          // клик на кнопку вниз
          // последний элемент перемещаем вперед и анимируем позицию left у родителя
          sliderWr.find('.pict__item:last').prependTo(sliderWr).parent().css({
            left: scrollSliderWidth
          }).animate({
            left: 0
          }, 800); // слайдер кнопки вниз

          controlDownWrap.find('.control-down__item:last').prependTo(controlDownWrap).parent().css({
            top: scrollControlHeight
          }).animate({
            top: 0
          }, 800); // слайдер кнопки вверх при клике вниз

          controlUpWrap.find('.control-up__item:last').prependTo(controlUpWrap).parent().css({
            top: scrollControlHeight
          }).animate({
            top: 0
          }, 800); // слайдер колонки описания

          cardsWr.find('.p-card:first').fadeOut(300).removeClass('p-card_active');
          cardsWr.find('.p-card:last').prependTo(cardsWr).delay(300).fadeIn(200);
        }
        break;
    }
  } // изменение размера слайдера


  function updateSliderSize() {
    var slideListWidth = $('.slider__pict').width(),
        sliderControlHeigth = $('.slider__control').height();
    $('.pict__item').css({
      'width': slideListWidth
    });
    $('.control__item').css({
      'height': sliderControlHeigth
    });
  } // слежение за изменением размера окна


  $(window).resize(function () {
    updateSliderSize();
  }); // всплывающее меню

  (function () {
    // открытие
    $('.gamburger__link').click(function (e) {
      e.preventDefault();
      $('.menu-pop').css({
        display: 'flex'
      }).delay(100).animate({
        height: '100vh'
      }, 200, function () {
        $('.menu-pop__list').animate({
          opacity: 1
        }, 200);
        $('.gamburger__link').animate({
          opacity: 0
        }, 200);
        $('.menu-pop__item').each(function (index, value) {
          $(value).css({
            'animation-delay': "".concat(index * 0.1, "s")
          }).css({
            'animation-name': 'bounceIn'
          });
        });
        $('.close__link').css({
          'animation-name': 'bounceIn'
        }).animate({
          opacity: 1
        }, 200);
      }); // отключение скрола при его видимости

      $('body').addClass('stop-scroll-but-visible');
      setTimeout(function () {
        $('.menu-pop__item').removeAttr('style');
        $('.close__link').removeAttr('style').css({
          opacity: 1
        });
      }, 1200);
    }); // закрытие
    // клик по кресту

    $('.close__link').click(function (e) {
      e.preventDefault();
      e.stopPropagation();
      closePopMenu();
    });
    $('.menu-pop__link').click(function () {
      closePopMenu();
    }); // клик по активной ссылке меню

    $('.menu-pop__item_active').click(function (e) {
      e.stopPropagation();
      e.preventDefault();
      closePopMenu();
    });
  })();

  function closePopMenu() {
    $('.menu-pop').delay(100).animate({
      height: 0
    }, 200, function () {
      $('.close__link').removeAttr('style');
      $('.gamburger__link').animate({
        opacity: 1
      }, 100);
      $('.menu-pop').css({
        display: 'none'
      });
      $('.menu-pop__list').css({
        opacity: 0
      }); // включение скрола

      $('body').removeClass('stop-scroll-but-visible');
    });
  } // map


  function setMapParams() {
    var width = $(window).width();

    if (width > 1200) {
      mapInit(82.902, 55.013, 12.8);
    }

    if (width > 899 && width < 1201) {
      mapInit(82.920, 55.013, 14.8);
    }

    if (width > 768 && width < 900) {
      mapInit(82.9216, 55.013, 14.8);
    }

    if (width > 550 && width < 769) {
      mapInit(82.920, 55.013, 14);
    }

    if (width < 551) {
      mapInit(82.928, 55.020, 13);
    }
  }

  function mapInit(centerCoordLeft, centerCoordTop, zoom) {
    mapboxgl.accessToken = 'pk.eyJ1IjoiY29udHJhNzciLCJhIjoiY2p0anR2MWEwMnZrMjN5cDhsbXczeDJ1cSJ9.Q9r4aUzdARiggKd4gEmFDA';
    var map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/contra77/cju1na88e1fs41fpme09mg25a',
      center: [centerCoordLeft, centerCoordTop],
      zoom: zoom
    });
    map.scrollZoom.disable(); // запрет зума мышью

    if ($(window).width() > 550) {
      map.addControl(new mapboxgl.NavigationControl(), 'top-left'); // кнопки зума
    }

    var marker = new mapboxgl.Marker({
      color: '#82a073'
    }) // маркер
    .setLngLat([82.929158, 55.012969]).addTo(map);
  } // проверка формы авторизации


  (function () {
    if ($('.form-auth').length) {
      $('.butt__link_login').on('click', function (e) {
        e.preventDefault();

        if ($.trim($('.form__name').val()) !== '') {
          if ($.trim($('.form__pass').val()) !== '') {
            if ($('.checkbox__input').is(':checked')) {
              if ($('.radio-btn__input_yes').is(':checked')) {
                showAlertWindow('Неправильный логин или пароль');
              } else {
                showAlertWindow('Роботам вход воспрещен');
              }
            } else {
              showAlertWindow('Роботам вход воспрещен');
            }
          } else {
            showAlertWindow('Введите пароль');
            $('.form__pass').val('');
          }
        } else {
          showAlertWindow('Введите Логин');
          $('.form__name').val('');
        }
      });
      $('.butt__link_home').on('click', function (e) {
        $('.form-auth')[0].reset();
      });
    }
  })(); // проверка формы контакта


  (function () {
    if ($('.form-log').length) {
      $('.butt__link_send').on('click', function (e) {
        e.preventDefault();

        if ($.trim($('.form__inp-contact_name').val()) !== '') {
          if ($.trim($('.form__inp-contact_email').val()) !== '' && /@/.test($('.form__inp-contact_email').val())) {
            if ($.trim($('.form__textarea').val()) !== '') {
              showAlertWindow('Сообщение отправлено');
            } else {
              showAlertWindow('Введите сообщение');
              $('.form__textarea').val('');
            }
          } else {
            showAlertWindow('Введите почту');
            $('.form__inp-contact_email').val('');
          }
        } else {
          showAlertWindow('Введите имя');
          $('.form__inp-contact_name').val('');
        }
      });
      $('.butt__link_clear').on('click', function (e) {
        e.preventDefault();
        $('.form-log')[0].reset();
      });
    }
  })(); // вывод окна с ошибкой


  (function () {
    $('body').append("<div class=\"alertWindow-wr\"><p class=\"alertWindow\"></p></div>");
    $('.alertWindow-wr').toggleClass('hide');
  })();

  function showAlertWindow(message) {
    $('.alertWindow').text(message);
    $('.alertWindow-wr').css({
      display: 'flex'
    });
    setTimeout(function () {
      $('.alertWindow-wr').toggleClass('hide');
    }, 100);
  } // закрытие окна с ошибкой


  $(document).on('click', function (e) {
    if ($(e.target).closest($('.alertWindow-wr')).length) {
      $('.alertWindow-wr').toggleClass('hide');
      setTimeout(function () {
        $('.alertWindow-wr').css({
          display: 'none'
        });
      }, 400);
    }

    e.stopPropagation();
  });
  showPage();
});