import { useContext, useState, useEffect } from "react";
import { formatDistanceToNow } from "date-fns";
import ptBR from "date-fns/locale/pt-BR";
import { compareDesc } from "date-fns";
import { CyclesContext } from "../../context/CyclesContext";
import { Cycle } from "../../reducers/cycles/reducer";
import { MdDelete } from "react-icons/md";
import {
  HistoryContainer,
  HistoryList,
  Status,
  NoProjectsMessage,
} from "./styles";
import "./scroll.css";

interface ObjCycles {
  cycles: Cycle[];
}

export function History() {
  const { cycles } = useContext(CyclesContext);
  const [updatedCycles, setUpdatedCycles] = useState<Cycle[]>([]);

  function deleteItem(cycleId: string) {
    const data = localStorage.getItem("@ignite-timer:cycles-state-1.0.0");

    if (!data) {
      return false;
    }

    const parsedData = JSON.parse(data) as ObjCycles;
    const newCycle = parsedData.cycles.filter((item) => item.id !== cycleId);

    setUpdatedCycles(newCycle);

    localStorage.removeItem("@ignite-timer:cycles-state-1.0.0");
    localStorage.setItem(
      "@ignite-timer:cycles-state-1.0.0",
      JSON.stringify({
        cycles: newCycle,
        activeCycleId: null,
      })
    );
  }

  function compareByStartDate(a: Cycle, b: Cycle) {
    return compareDesc(new Date(a.startDate), new Date(b.startDate));
  }

  useEffect(() => {
    const sortedCycles = [...updatedCycles].sort(compareByStartDate);
    setSortedCycles(sortedCycles);
  }, [updatedCycles]);

  const [sortedCycles, setSortedCycles] = useState<Cycle[]>([]);

  useEffect(() => {
    const sortedCycles = [...cycles].sort(compareByStartDate);
    setSortedCycles(sortedCycles);
  }, [cycles]);

  return (
    <HistoryContainer>
      <h1>Meu histórico</h1>

      {sortedCycles.length === 0 ? (
        <NoProjectsMessage>
          Não há nenhum projeto criado ainda.
        </NoProjectsMessage>
      ) : (
        <HistoryList>
          <table>
            <thead>
              <tr>
                <th>Tarefa</th>
                <th>Duração</th>
                <th>Início</th>
                <th>Status</th>
                <th className="delete">Delete</th>
              </tr>
            </thead>
            <tbody>
              {sortedCycles.map((cycle) => {
                return (
                  <tr key={cycle.id}>
                    <td>{cycle.task}</td>
                    <td>{cycle.minutesAmount} minutos</td>
                    <td>
                      {formatDistanceToNow(new Date(cycle.startDate), {
                        addSuffix: true,
                        locale: ptBR,
                      })}
                    </td>
                    <td>
                      {cycle.finishedDate ? (
                        <Status statusColor="green">Concluído</Status>
                      ) : cycle.interruptedDate ? (
                        <Status statusColor="red">Interrompido</Status>
                      ) : (
                        <Status statusColor="yellow">Em andamento</Status>
                      )}
                    </td>
                    <td>
                      <button
                        className="DeleteButton"
                        onClick={() => deleteItem(cycle.id)}
                      >
                        <MdDelete size={22} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </HistoryList>
      )}
    </HistoryContainer>
  );
}
