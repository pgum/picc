import os
from threading import Lock
from flask import Flask, render_template, send_from_directory
from flask_socketio import SocketIO, emit

app = Flask(__name__, instance_relative_config=True, template_folder=os.path.abspath('./gui'))
app.config.from_mapping(
  SECRET_KEY='klm',
  DATABASE= os.path.join(app.instance_path, 'picc.sqlite'),
  )
async_mode=None
socketio = SocketIO(app, async_mode=async_mode)
thread = None
thread_lock = Lock()

app.config.from_pyfile('config.py', silent=True)

try:
  os.makedirs(app.instance_path)
except OSError:
  pass

def background_thread():
  "Example how to send server generated events"""
  count= 0
  while True:
    socketio.sleep(10)
    count+=1
    socketio.emit('my_response', {'data': 'Server generated event', 'count': count}, namespace='/test')

@app.route('/')
def hello():
  return render_template('gui.html', async_mode=socketio.async_mode)
@app.route('/js/<path:path>')
def send_js(path):
  return send_from_directory('./gui/js',path)
@app.route('/img/<path:path>')
def send_img(path):
  return send_from_directory('./gui/img',path)
@app.route('/css/<path:path>')
def send_css(path):
  return send_from_directory('./gui/css',path)
@app.route('/metro/<path:path>')
def send_metro(path):
  return send_from_directory('./gui/metro',path)

@socketio.on('connect', namespace='/test')
def test_connection():
  global thread
  with thread_lock:
    if thread is None:
      thread = socketio.start_background_task(target=background_thread)
  emit('my_response', {'data': 'Connected', 'count':0})

if __name__ == '__main__':
  socketio.run(app, host='0.0.0.0', debug=True)
