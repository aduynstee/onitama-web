import os
import re

pattern = re.compile(r"main\.\w+\.js")
js_directory = r'..\..\onitama_site\onitama_game\reactbuild\static\js'

for filename in os.listdir(js_directory):
    if filename.endswith(".js"):
        script_name = pattern.search(filename).group(0)

pattern = re.compile(r"main\.\w+\.css")
css_directory = r'..\..\onitama_site\onitama_game\reactbuild\static\css'

for filename in os.listdir(css_directory):
    if filename.endswith(".css"):
        stylesheet_name = pattern.search(filename).group(0)

script = '"\static\js\{}"'.format(script_name)
stylesheet = '"\static\css\{}"'.format(stylesheet_name)

style_pat = re.compile(r';;game_stylesheet;;')
script_pat = re.compile(r';;game_script;;')

with open(r'..\..\onitama_site\onitama_game\templates\onitama_game\game.template.html', 'r') as template:
    with open(r'..\..\onitama_site\onitama_game\templates\onitama_game\game.html', 'w') as output:
        for line in template:
            line = re.sub(script_pat, script, line)
            line = re.sub(style_pat, stylesheet, line)
            output.write(line)
