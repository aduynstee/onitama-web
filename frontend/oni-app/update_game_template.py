import os
import re

pattern = re.compile(r"main\.(?P<name>.+)\.js")
js_directory = r'..\..\onitama_site\onitama_game\reactbuild\static\js'

for filename in os.listdir(js_directory):
    if filename.endswith(".js"):
        result = pattern.search(filename)
        script_name = result.group("name")

pattern = re.compile(r"main\.(?P<name>.+)\.css")
css_directory = r'..\..\onitama_site\onitama_game\reactbuild\static\css'

for filename in os.listdir(css_directory):
    if filename.endswith(".css"):
        result = pattern.search(filename)
        stylesheet_name = result.group("name")

template = r'''<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8"/>
      <link href="/static/css/main.{}.css" rel="stylesheet">
      <title>Game</title>
  </head>
  <body>
    <div id="root"></div>
    <script>
      window.socketAddress = "ws://"+window.location.host+"{{{{socket_path}}}}";
    </script>
    <script type="text/javascript" src="/static/js/main.{}.js"></script>
  </body>
</html>'''.format(stylesheet_name, script_name)

with open(r'..\..\onitama_site\onitama_game\templates\onitama_game\game.html', 'w') as f:
    f.write(template)
