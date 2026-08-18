from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
import json
from typing import Optional

from app.db.session import get_db
from app.models.user import User
from app.models.watchlist import WatchlistItem
from app.schemas.watchlist import WatchlistCreate, WatchlistUpdate, WatchlistResponse, WatchlistListResponse
from app.api.deps import get_current_user

router = APIRouter(prefix="/watchlist", tags=["Watchlist"])

@router.get("", response_model=WatchlistListResponse)
def get_watchlist(
    status_filter: Optional[str] = Query(None, alias="status"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    query = db.query(WatchlistItem).filter(WatchlistItem.user_id == current_user.id)
    if status_filter:
        query = query.filter(WatchlistItem.status == status_filter)
    
    items = query.order_by(WatchlistItem.created_at.desc()).all()

    response_items = []
    for item in items:
        try:
            genres_list = json.loads(item.genres_json) if item.genres_json else []
        except Exception:
            genres_list = []

        response_items.append(
            WatchlistResponse(
                id=item.id,
                movie_id=item.movie_id,
                title=item.title,
                poster_path=item.poster_path,
                backdrop_path=item.backdrop_path,
                overview=item.overview,
                release_date=item.release_date or "",
                vote_average=item.vote_average or 0.0,
                genres=genres_list,
                emotion_label=item.emotion_label,
                status=item.status,
                created_at=item.created_at
            )
        )

    return WatchlistListResponse(total=len(response_items), items=response_items)

@router.post("", response_model=WatchlistResponse, status_code=status.HTTP_201_CREATED)
def add_to_watchlist(
    item_in: WatchlistCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    existing = (
        db.query(WatchlistItem)
        .filter(WatchlistItem.user_id == current_user.id, WatchlistItem.movie_id == item_in.movie_id)
        .first()
    )
    if existing:
        # If already exists, return existing
        try:
            genres_list = json.loads(existing.genres_json) if existing.genres_json else []
        except Exception:
            genres_list = []
        return WatchlistResponse(
            id=existing.id,
            movie_id=existing.movie_id,
            title=existing.title,
            poster_path=existing.poster_path,
            backdrop_path=existing.backdrop_path,
            overview=existing.overview,
            release_date=existing.release_date or "",
            vote_average=existing.vote_average or 0.0,
            genres=genres_list,
            emotion_label=existing.emotion_label,
            status=existing.status,
            created_at=existing.created_at
        )

    new_item = WatchlistItem(
        user_id=current_user.id,
        movie_id=item_in.movie_id,
        title=item_in.title,
        poster_path=item_in.poster_path,
        backdrop_path=item_in.backdrop_path,
        overview=item_in.overview,
        release_date=item_in.release_date or "",
        vote_average=item_in.vote_average,
        genres_json=json.dumps(item_in.genres),
        emotion_label=item_in.emotion_label,
        status=item_in.status
    )
    db.add(new_item)
    db.commit()
    db.refresh(new_item)

    return WatchlistResponse(
        id=new_item.id,
        movie_id=new_item.movie_id,
        title=new_item.title,
        poster_path=new_item.poster_path,
        backdrop_path=new_item.backdrop_path,
        overview=new_item.overview,
        release_date=new_item.release_date or "",
        vote_average=new_item.vote_average or 0.0,
        genres=item_in.genres,
        emotion_label=new_item.emotion_label,
        status=new_item.status,
        created_at=new_item.created_at
    )

@router.patch("/{movie_id}", response_model=WatchlistResponse)
def update_watchlist_status(
    movie_id: int,
    update_in: WatchlistUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    item = (
        db.query(WatchlistItem)
        .filter(WatchlistItem.user_id == current_user.id, WatchlistItem.movie_id == movie_id)
        .first()
    )
    if not item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Movie not found in watchlist.")

    item.status = update_in.status
    db.commit()
    db.refresh(item)

    try:
        genres_list = json.loads(item.genres_json) if item.genres_json else []
    except Exception:
        genres_list = []

    return WatchlistResponse(
        id=item.id,
        movie_id=item.movie_id,
        title=item.title,
        poster_path=item.poster_path,
        backdrop_path=item.backdrop_path,
        overview=item.overview,
        release_date=item.release_date or "",
        vote_average=item.vote_average or 0.0,
        genres=genres_list,
        emotion_label=item.emotion_label,
        status=item.status,
        created_at=item.created_at
    )

@router.delete("/{movie_id}", status_code=status.HTTP_204_NO_CONTENT)
def remove_from_watchlist(
    movie_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    item = (
        db.query(WatchlistItem)
        .filter(WatchlistItem.user_id == current_user.id, WatchlistItem.movie_id == movie_id)
        .first()
    )
    if not item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Movie not found in watchlist.")

    db.delete(item)
    db.commit()
    return None
