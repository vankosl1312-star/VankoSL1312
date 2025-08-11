ClientsBG - Electron приложение (Български)
-----------------------------------------
Как да стартираш (dev режим):
1. Разархивирай тази папка.
2. Отвори папката и стартирай start_app.bat (двойно клик) или в терминал:
   npm install
   npm start
3. Приложението ще се отвори като десктоп прозорец.

Как да компилираш EXE (локално):
1. Инсталирай Node.js (последна LTS).
2. В папката изпълни:
   npm install
   npm run dist
   (electron-builder ще създаде installer в dist/)
3. За да зададеш собствена иконка, сложи book.ico в build/icons/

Файлове:
- main.js (Electron main process)
- preload.js (API към renderer)
- /src (frontend)
- /data/clients.db (SQLite база с примерни записи А-Я)
- start_app.bat (бърз старт)
- build/icons/book.png и book.ico (иконка - заменяй по желание)

Бележки:
- Първото стартиране ще изтегли зависимостите (electron, sqlite3).
- Ако искаш, мога да ти подготвя и вече компилирано EXE — кажи само дали искаш 64-bit Windows installer.


=== GitHub Actions — бързи стъпки ===

1. Създай нов публичен репозиторий в GitHub (или използвай съществуващ).
2. Копирай/плъзни всички файлове от тази папка в репото и направи push към main.
   Например (локално):
     git init
     git add .
     git commit -m "Initial"
     git branch -M main
     git remote add origin https://github.com/USERNAME/REPO.git
     git push -u origin main

3. Отиди в GitHub -> Actions и виж workflow 'Build Windows Portable EXE' да се изпълнява.
4. Когато завърши, от Actions -> build-windows -> изпълнение -> Artifacts -> clientsbg-dist ще има ZIP с готовото portable EXE.
