from flask import Blueprint, request, jsonify, abort
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime

from petShop.models import db, User, Question  # ✅ DB 모델은 그대로 Question

# ✅ Blueprint 이름과 url을 post 기준으로 통일
post_bp = Blueprint("post", __name__, url_prefix="/api/post")


def _get_current_user():
    """
    토큰에서 user_id를 꺼내고
    DB에서 유저를 다시 조회해서 '이 요청의 주인'을 확정
    """
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    if not user:
        abort(401)
    return user


def _is_admin(user: User) -> bool:
    """관리자 여부 판단"""
    return user.role == "ADMIN"


@post_bp.route("", methods=["POST"])
@jwt_required()
def create_post():
    """
    게시글 생성
    - 로그인 필수
    - 공지(NOTICE)는 ADMIN만 가능
    - writer/email은 서버가 User 정보로 결정
    """
    user = _get_current_user()

    data = request.get_json() or {}
    title = (data.get("title") or "").strip()
    content = (data.get("content") or "").strip()
    board_type = (data.get("boardType") or "FREE").strip()

    if not title or not content:
        return jsonify({"message": "title/content는 필수입니다."}), 400

    # ✅ 공지는 관리자만
    if board_type == "NOTICE" and not _is_admin(user):
        return jsonify({"message": "공지 작성 권한이 없습니다."}), 403

    post = Question(
        title=title,
        content=content,
        board_type=board_type,
        user_id=user.id,          # ✅ 권한 판단의 핵심
        writer=user.nickname,     # ✅ 서버가 확정
        email=user.email,         # ✅ 서버가 확정
        created_at=datetime.utcnow()
    )

    db.session.add(post)
    db.session.commit()

    return jsonify({"id": post.id, "message": "created"}), 201


@post_bp.route("/<int:post_id>", methods=["PATCH"])
@jwt_required()
def update_post(post_id):
    """
    게시글 수정
    - 본인 글이거나 ADMIN만 가능
    """
    user = _get_current_user()
    post = Question.query.get_or_404(post_id)

    if post.user_id != user.id and not _is_admin(user):
        return jsonify({"message": "수정 권한이 없습니다."}), 403

    data = request.get_json() or {}

    if "title" in data:
        post.title = data["title"].strip()
    if "content" in data:
        post.content = data["content"].strip()

    # 공지 타입 변경도 ADMIN만 허용
    if "boardType" in data:
        new_type = data["boardType"].strip()
        if new_type == "NOTICE" and not _is_admin(user):
            return jsonify({"message": "공지로 변경할 권한이 없습니다."}), 403
        post.board_type = new_type

    post.updated_at = datetime.utcnow()
    db.session.commit()

    return jsonify({"message": "updated"}), 200


@post_bp.route("/<int:post_id>", methods=["DELETE"])
@jwt_required()
def delete_post(post_id):
    """
    게시글 삭제
    - 본인 글이거나 ADMIN만 가능
    """
    user = _get_current_user()
    post = Question.query.get_or_404(post_id)

    if post.user_id != user.id and not _is_admin(user):
        return jsonify({"message": "삭제 권한이 없습니다."}), 403

    db.session.delete(post)
    db.session.commit()

    return jsonify({"message": "deleted"}), 200
