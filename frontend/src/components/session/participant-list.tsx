import { Badge } from "@/components/ui/badge";
import type { GroupParticipant } from "@/lib/session-api";

export function ParticipantList({
  participants,
}: {
  participants: GroupParticipant[];
}) {
  if (participants.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        Aún nadie ha completado el quiz.
      </p>
    );
  }

  return (
    <div className="space-y-2">
      {participants.map((p) => (
        <div
          key={p.id}
          className="flex items-center justify-between rounded-lg border p-3"
        >
          <div>
            <p className="font-medium">{p.name}</p>
            {p.characterName && (
              <p className="text-sm text-muted-foreground">
                {p.characterName}
              </p>
            )}
          </div>
          <Badge variant="secondary">Completado</Badge>
        </div>
      ))}
    </div>
  );
}
