package com.traineasy.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.traineasy.dto.CreateTreinoRequest;
import com.traineasy.dto.TreinoResponse;
import com.traineasy.entity.Treino;
import com.traineasy.repository.TreinoRepository;

@Service
public class TreinoService {

    private final TreinoRepository treinoRepository;

    public TreinoService(TreinoRepository treinoRepository) {
        this.treinoRepository = treinoRepository;
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

    public TreinoResponse getTreinosByUser(Long userId) {
        List<Treino> treinos = treinoRepository.findByUserIdOrderByCreatedAtDesc(userId);

        List<TreinoResponse.TreinoData> lista = treinos.stream()
                .map(this::toData)
                .toList();

        return TreinoResponse.successList("Treinos carregados.", lista);
    }

    public TreinoResponse deleteTreino(Long id) {
        if (!treinoRepository.existsById(id)) {
            return TreinoResponse.error("Treino não encontrado.");
        }

        treinoRepository.deleteById(id);
        return TreinoResponse.success("Treino excluído com sucesso!", null);
    }

    private TreinoResponse.TreinoData toData(Treino treino) {
        return new TreinoResponse.TreinoData(
                treino.getId(),
                treino.getNome(),
                treino.getTipo(),
                treino.getUserId(),
                treino.getCreatedAt());
    }
}
