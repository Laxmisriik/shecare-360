# TODO - Menstrual Care Website

## Diet Tracker API (Phase 2 — done)
- [x] Implement missing Flask routes in `mental_health_journal/routes/diet_routes.py`:
  - [x] `GET /api/diet/history` returning items with `meal_type`, `food_item`, `nutrients`, `logged_at` (most recent 100).
  - [x] `GET /api/diet/recommendations` returning `missing_nutrients` and `food_recommendations`.
  - Note: identity is JWT-derived (`get_jwt_identity()`), so the `<user_id>` path param was dropped in favour of `/api/diet/history` and `/api/diet/recommendations`.

## Compatibility fixes (already done)
- [x] Handle `google.genai` import differences in `mental_health_journal/nlp/chatbot.py`.
- [x] Fix blueprint registration in `mental_health_journal/app.py` so diet routes use `/api/diet`.

## Run / verify
- [ ] Restart Flask and Vite; verify DietTracker page loads without 404s for diet history/recommendations.

