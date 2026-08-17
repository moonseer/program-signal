from editorial_runtime.models import EditorialDecision, EditorialDecisionStatus, PersonaName


def test_editorial_decision_round_trip():
    decision = EditorialDecision(
        status=EditorialDecisionStatus.APPROVE,
        reason="fits mission",
        content_type="explainer",
        author_persona=PersonaName.maya,
        central_thesis="MCP is a protocol platforms must operate.",
    )
    payload = decision.model_dump(mode="json")
    assert payload["status"] == "APPROVE"
    assert EditorialDecision.model_validate(payload).author_persona == PersonaName.maya
