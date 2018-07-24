rmdir /s /q ..\..\onitama_site\onitama_game\reactbuild\
xcopy .\build\* ..\..\onitama_site\onitama_game\reactbuild\ /E
python update_game_template.py
