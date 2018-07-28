import os
import re

pattern = re.compile(r"main\.(?P<name>.+)\.js")
directory = r'..\..\onitama_site\onitama_game\reactbuild\static\js'

for filename in os.listdir(directory):
    if filename.endswith(".js"):
        result = pattern.search(filename)
        output_name = result.group("name")

template = r'''<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8"/>
      <link href="/static/css/main.a8da6748.css" rel="stylesheet">
      <title>Game</title>
  </head>
  <body>
    <div id="root"></div>
    <script>
      window.socketAddress = "{{socket_url}}";
    </script>
    <script type="text/javascript" src="/static/js/main.'+output_name+'.js"></script>
  </body>
</html>'''

with open(r'..\..\onitama_site\onitama_game\templates\onitama_game\game.html', 'w') as f:
    f.write(template)
