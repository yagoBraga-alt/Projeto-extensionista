from flask import Flask, render_template, request, redirect, url_for
import mysql.connector
from datetime import date

app = Flask(__name__)

# Função de conexão com o banco
def get_db_connection():
    conn = mysql.connector.connect(
        host="localhost",
        user="root",
        password="",
        database="biscoito"
    )
    return conn

print("Conexão com MariaDB realizada com sucesso!")

# ------------------ ROTAS ------------------
@app.route('/')
def initial_page():
    return render_template('Tela Login ADM/index.html')

@app.route("/login", methods=["GET", "POST"])
def login_page():
    mensagem = None
    if request.method == "POST":
        usuario = request.form["usuario"]
        senha = request.form["senha"]

        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM login WHERE usuario=%s AND senha=%s", (usuario, senha))
        user = cursor.fetchone()
        cursor.close()
        conn.close()

        if user:
            return redirect(url_for("menu_page"))
        else:
            mensagem = "Usuário ou senha inválidos!"

    return render_template("Tela Login ADM/index.html", mensagem=mensagem)

@app.route("/menu")
def menu_page():
    return render_template("Menu Principal ADM/index.html")

@app.route("/javascript")
def javascript():
    return render_template("Tela Editar Insumos/arquivo.js")

@app.route("/receitaJs")
def receitaJs():
    return render_template("Tela Receitas/arquivo.js")

@app.route("/insumos")
def insumos_page():
    return render_template("Tela insumos/index.html")

@app.route("/receitas")
def receitas_page():
    return render_template("Tela Receitas/index.html")

@app.route("/editar_insumos", methods=["GET", "POST"])
def editar_insumos_page():
    if request.method == 'POST':
        nome = request.form.get('nome')
        unidade = request.form.get('unidade')
        validade = request.form.get('validade')

        try:
            quantidade = float(request.form.get('quantidade', 0))
        except (ValueError, TypeError):
            return "Quantidade inválida", 400
        
        if not nome or quantidade <= 0 or not unidade or not validade:
            return "Campos inválidos", 400

        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("""
            INSERT INTO insumos (nome, quantidade, unidade, dataEntrada, validade)
            VALUES (%s, %s, %s, %s, %s)
        """, (nome, quantidade, unidade, date.today(), validade))
        conn.commit()
        cursor.close()
        conn.close()

        return redirect(url_for('insumos_page'))

    # GET
    nome = request.args.get('nome', '')
    return render_template("Tela Editar Insumos/index.html", nome=nome)

if __name__ == "__main__":
    app.run(debug=True)
