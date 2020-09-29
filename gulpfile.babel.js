var gulp = require('gulp'), // подключаем gulp
    sass = require('gulp-sass'), //подключаем sass
    browserSync = require('browser-sync').create(), // подключаем browser sync
    concat = require('gulp-concat'), // подключаем gulp-concat (для конкатенации файлов)
    uglify = require('gulp-uglifyjs'), // подключаем gulp-uglify (для сжатия js)
    cssnano = require('gulp-cssnano'), // подключаем пакет для минификации css
    rename = require('gulp-rename'), // подключаем библиотеку для переименования файлов
    del = require('del'), // подключаем библиотеку для удаления файлов и папок
    imagemin = require('gulp-imagemin'), // подключаем библиотеку для работы с изображениями
    pngquant = require('imagemin-pngquant'), // подключаем библиотеку для работы с png
    cache = require('gulp-cache'), // подключаем библиотеку кеширования
    autoprefixer = require('gulp-autoprefixer'), // подключаем библиотеку для автоматического добавления префиксов
    plumber = require('gulp-plumber'), // вывод ошибок sass
    pug = require('gulp-pug'), // подключаем шаблонизатор pug
    babel = require('gulp-babel'),// babel
    htmlmin = require('gulp-htmlmin'),
    cleanCSS = require('gulp-clean-css');

// таск "sass"
gulp.task('sass', function() {
    return gulp.src('app/sass/main.scss') //берем источник
        .pipe(plumber()) //не выбрасывать из компилятора если есть ошибки
        .pipe(sass({
                includePaths: require('node-normalize-scss').includePaths
                }).on('error', sass.logError)) //преобразуем sass в css посредством gulp-sass
        .pipe(autoprefixer(['last 15 versions', '> 1%'], {cascade: true})) // создаем префиксы
        .pipe(gulp.dest('app/style/css')) // выгружаем результат в папку app/css
        .pipe(browserSync.reload({stream: true})); //обновляем css на странице при изменении
});

// таск "pug"
gulp.task('pug', function buildHTML() {
    return gulp.src('app/pug/*.pug') // берем файлы pug
        .pipe(pug({pretty:true})) //  конвертируем в html
        .pipe(gulp.dest('app')) // помещаем в эту папку
        .pipe(browserSync.reload({stream: true})); //обновляем css на странице при изменении
});

gulp.task('babel', () =>
    gulp.src('app/js/es6/main.js')
        .pipe(babel({
            presets: ['@babel/env']
        }))
        .pipe(gulp.dest('app/js'))
);

//таск "browser-sync"
gulp.task('browser-sync', function() {
    browserSync.init({
        server: {
            baseDir: "app"
        }
    });
});

// таск конкатенации и сжатия файлов библиотек
gulp.task('scripts', function() {
    return gulp.src([ // берем все необходимые библиотеки
        './node_modules/jquery/dist/jquery.js', // берем jQuery
        './node_modules/flip/dist/jquery.flip.js', // flip
        './node_modules/fontfaceobserver/fontfaceobserver.js', // fontFaceObserver
    ])
        .pipe(concat('libs.min.js')) // собираем их в кучу в новом файле libs.min.js
        .pipe(uglify()) // сжимаем js файл
        .pipe(gulp.dest('app/js')); // выгружаем в папку app/js
});

// таск конкатенации и сжатия файла доп. библиотек
gulp.task('main', function() {
    return gulp.src([
        'app/js/main.js' // берем main
    ])
        .pipe(concat('main.min.js')) // собираем в новом файле main.min.js
        .pipe(uglify()) // сжимаем js файл
        .pipe(gulp.dest('app/js')); // выгружаем в папку app/js
});

// таск конкатенации и сжатия файла доп. библиотек
gulp.task('water', function() {
    return gulp.src([ // берем все необходимые библиотеки
        'app/js/water.js' // берем water
    ])
        .pipe(concat('water.min.js')) // собираем их в кучу в новом файле libs.min.js
        .pipe(uglify()) // сжимаем js файл
        .pipe(gulp.dest('app/js')); // выгружаем в папку app/js
});

// таск минимизации, сжатия и переименования файла
gulp.task('css-libs', ['sass'], function(){
    return gulp.src('app/style/css/libs.css') // выбираем файл для минификации
        .pipe(cssnano()) // сжимаем
        .pipe(rename({suffix: '.min'})) // добавляем суффикс .min
        .pipe(gulp.dest('app/style/css')); // выгружаем в папку app/css
});

// таск наблюдения за изменениями файлов
gulp.task('watch', ['browser-sync', 'css-libs', 'scripts'], function() { //создаем таск "watch"
    gulp.watch('app/pug/**/*.pug', ['pug']); //наблюдение за pug файлами
    gulp.watch('app/sass/**/*.scss', ['sass']); //наблюдение за sass файлами
    gulp.watch('app/js/es6/main.js', ['babel']); //наблюдение за js файлами es6
    gulp.watch('app/*.html', browserSync.reload); // наблюдение за html файлами
    gulp.watch('app/js/main.js', browserSync.reload); // наблюдение за js файлами
});

// таск очистки папки
gulp.task('clean', function() {
    return del.sync('dist'); // удаляем папку dist перед сборкой
});

// таск обработки изображений
gulp.task('img', function() {
    return gulp.src('app/style/img/**/*') // берем все изображения из app
            .pipe(imagemin([
                imagemin.gifsicle({interlaced: true}),
                imagemin.jpegtran({progressive: true}),
                imagemin.optipng({optimizationLevel: 5}),
                imagemin.svgo({
                    plugins: [
                        {removeViewBox: true},
                        {cleanupIDs: false}
                    ]
                })
            ]))
            .pipe(gulp.dest('dist/style/img')); // выгружаем на продакшн
});

// таск сборки в папку dist (продакшн)
gulp.task('build', ['clean', 'img', 'sass', 'scripts', 'main', 'water'], function() {

    var buildCss = gulp.src( // преносим css стили в продакшн
        'app/style/css/*.css'
    )
        .pipe(cleanCSS())
        .pipe(gulp.dest('dist/style/css'));

    var buildFonts = gulp.src('app/style/fonts/**/*') // переносим шрифты в продакшн
        .pipe(gulp.dest('dist/style/fonts'));

    var buildJs = gulp.src('app/js/*.min.js') //  переносим скрипты в продакшн
        .pipe(gulp.dest('dist/js'));

    var buildHtml = gulp.src('app/*.html') // переносим html  в продакшн
        .pipe(htmlmin({
            collapseWhitespace: true,
            removeComments: true
        }))
        .pipe(gulp.dest('dist'));
});

// таск для очистки кеша
gulp.task('clear', function() {
    return cache.clearAll();
});

// дефолтный таск
gulp.task('default', ['watch']);
