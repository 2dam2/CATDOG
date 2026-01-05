from petShop.models import Question, User
from flask import render_template, request, url_for, redirect, flash, abort, jsonify, Blueprint
from flask_jwt_extended import jwt_required, get_jwt_identity

question_bp  = Blueprint('question', __name__, url_prefix='/api/question')


@question_bp.route('/', methods=['GET', 'POST'])
@jwt_required()
def new_question():
