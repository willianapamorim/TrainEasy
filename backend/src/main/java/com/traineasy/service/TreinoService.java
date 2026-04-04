package com.traineasy.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.traineasy.dto.CreateTreinoCompletoRequest;
import com.traineasy.dto.CreateTreinoRequest;
import com.traineasy.dto.TreinoCompletoResponse;
import com.traineasy.dto.TreinoResponse;
import com.traineasy.entity.DivisaoTreino;
import com.traineasy.entity.Exercicio;
import com.traineasy.entity.Treino;
import com.traineasy.repository.DivisaoTreinoRepository;
import com.traineasy.repository.TreinoRepository;

@Service
public class TreinoService {

    private final TreinoRepository treinoRepository;
    private final DivisaoTreinoRepository divisaoTreinoRepository;

    public TreinoService(TreinoRepository treinoRepository, DivisaoTreinoRepository divisaoTreinoRepository) {
        this.treinoRepository = treinoRepository;
        this.divisaoTreinoRepository = divisaoTreinoRepository;
    }

    public TreinoResponse createTreino(CreateTreinoRequest request) {
        Treino treino = new Treino();
        treino.setNome(request.getNome());
        treino.setTipo(request.getTipo());
        treino.setUserId(request.getUserId());

        Treino saved = treinoRepository.save(treino);

        return TreinoResponse.success(
                "Treino criado com sucesso!",
                toData(saved));
    }

    @Transactional
    public TreinoCompletoResponse createTreinoCompleto(CreateTreinoCompletoRequest request) {
        Treino treino = new Treino();
        treino.setNome(request.getNome());
        treino.setTipo(request.getTipo());
        treino.setUserId(request.getUserId());

        if (request.getDivisoes() != null) {
            for (CreateTreinoCompletoRequest.DivisaoRequest divReq : request.getDivisoes()) {
                DivisaoTreino divisao = new DivisaoTreino();
                divisao.setNome(divReq.getNome());
                divisao.setTreino(treino);

                if (divReq.getExercicios() != null) {
                    for (String nomeExercicio : divReq.getExercicios()) {
                        Exercicio exercicio = new Exercicio();
                        exercicio.setNome(nomeExercicio);
                        exercicio.setDivisao(divisao);
                        divisao.getExercicios().add(exercicio);
                    }
                }

                treino.getDivisoes().add(divisao);
            }
        }

        Treino saved = treinoRepository.save(treino);
        return TreinoCompletoResponse.success("Treino criado com sucesso!", toCompletoData(saved));
    }

    public TreinoResponse getTreinosByUser(Long userId) {
        List<Treino> treinos = treinoRepository.findByUserIdOrderByCreatedAtDesc(userId);

        List<TreinoResponse.TreinoData> lista = treinos.stream()
                .map(this::toData)
                .toList();

        return TreinoResponse.successList("Treinos carregados.", lista);
    }

    public TreinoCompletoResponse getTreinosCompletosByUser(Long userId) {
        List<Treino> treinos = treinoRepository.findByUserIdOrderByCreatedAtDesc(userId);

        List<TreinoCompletoResponse.TreinoCompletoData> lista = treinos.stream()
                .map(this::toCompletoData)
                .toList();

        return TreinoCompletoResponse.successList("Treinos carregados.", lista);
    }

    public TreinoCompletoResponse getTreinoCompleto(Long id) {
        return treinoRepository.findById(id)
                .map(treino -> TreinoCompletoResponse.success("Treino encontrado.", toCompletoData(treino)))
                .orElse(TreinoCompletoResponse.error("Treino não encontrado."));
    }

    @Transactional
    public TreinoResponse deleteTreino(Long id) {
        if (!treinoRepository.existsById(id)) {
            return TreinoResponse.error("Treino não encontrado.");
        }

        treinoRepository.deleteById(id);
        return TreinoResponse.success("Treino excluído com sucesso!", null);
    }

    @Transactional
    public TreinoCompletoResponse updateDivisaoExercicios(Long divisaoId, List<String> novosExercicios) {
        DivisaoTreino divisao = divisaoTreinoRepository.findById(divisaoId).orElse(null);
        if (divisao == null) {
            return TreinoCompletoResponse.error("Divisão não encontrada.");
        }

        divisao.getExercicios().clear();

        for (String nomeExercicio : novosExercicios) {
            Exercicio exercicio = new Exercicio();
            exercicio.setNome(nomeExercicio);
            exercicio.setDivisao(divisao);
            divisao.getExercicios().add(exercicio);
        }

        divisaoTreinoRepository.save(divisao);

        Treino treino = divisao.getTreino();
        return TreinoCompletoResponse.success("Exercícios atualizados com sucesso!", toCompletoData(treino));
    }

    private TreinoResponse.TreinoData toData(Treino treino) {
        return new TreinoResponse.TreinoData(
                treino.getId(),
                treino.getNome(),
                treino.getTipo(),
                treino.getUserId(),
                treino.getCreatedAt());
    }

    private TreinoCompletoResponse.TreinoCompletoData toCompletoData(Treino treino) {
        List<TreinoCompletoResponse.DivisaoData> divisoes = treino.getDivisoes().stream()
                .map(div -> new TreinoCompletoResponse.DivisaoData(
                        div.getId(),
                        div.getNome(),
                        div.getExercicios().stream()
                                .map(ex -> new TreinoCompletoResponse.ExercicioData(ex.getId(), ex.getNome()))
                                .toList()))
                .toList();

        return new TreinoCompletoResponse.TreinoCompletoData(
                treino.getId(),
                treino.getNome(),
                treino.getTipo(),
                treino.getUserId(),
                treino.getCreatedAt(),
                divisoes);
    }
}
