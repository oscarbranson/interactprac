# server.py
from flask import Flask, render_template, jsonify, request
from models.twobox import step

app = Flask(__name__, static_folder="../static/dist", template_folder="../static")

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/hello")
def hello():
    return "Hello World!"

@app.route("/sim", methods=['POST'])
def sim():
    simparams = request.get_json(force=True)
    return step(simparams)

if __name__ == "__main__":
    app.run()