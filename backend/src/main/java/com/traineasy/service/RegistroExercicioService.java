package com.traineasy.service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.traineasy.dto.RegistroExercicioRequest;
import com.traineasy.dto.RegistroExercicioResponse;
import com.traineasy.entity.Exercicio;
import com.traineasy.entity.RegistroExercicio;
import com.traineasy.repository.ExercicioRepository;
import com.traineasy.repository.RegistroExercicioRepository;

@Service
public class RegistroExercicioService {

    private final RegistroExercicioRepository registroRepository;
    private final ExercicioRepository exercicioRepository;

    public RegistroExercicioService(RegistroExercicioRepository registroRepository,
            ExercicioRepository exercicioRepository) {
        this.registroRepository = registroRepository;
        this.exercicioRepository = exercicioRepository;
    }

    public RegistroExercicioResponse registrar(RegistroExercicioRequest request) {
        Exercicio exercicio = exercicioRepository.findById(request.getExercicioId())
                .orElse(null);

        if (exercicio == null) {
            return RegistroExercicioResponse.error("Exercício não encontrado.");
        }

        RegistroExercicio registro = new RegistroExercicio();
        registro.setExercicio(exercicio);
        registro.setUserId(request.getUserId());
        registro.setCarga(request.getCarga());
        registro.setRepeticoes(request.getRepeticoes());
        registro.setNumeroSerie(request.getNumeroSerie());

        RegistroExercicio saved = registroRepository.save(registro);

        return RegistroExercicioResponse.success("Série registrada com sucesso!", toData(saved));
    }

    public RegistroExercicioResponse getRegistrosByExercicio(Long exercicioId, Long userId) {
        List<RegistroExercicio> registros = registroRepository
                .findByExercicioIdAndUserIdOrderByCreatedAtDesc(exercicioId, userId);

        List<RegistroExercicioResponse.RegistroData> lista = registros.stream()
                .map(this::toData)
                .toList();

        return RegistroExercicioResponse.successList("Registros carregados.", lista);
    }

    @Transactional
    public RegistroExercicioResponse updateRegistro(Long id, RegistroExercicioRequest request) {
        RegistroExercicio registro = registroRepository.findById(id).orElse(null);
        if (registro == null) {
            return RegistroExercicioResponse.error("Registro não encontrado.");
        }

        registro.setCarga(request.getCarga());
        registro.setRepeticoes(request.getRepeticoes());

        RegistroExercicio saved = registroRepository.save(registro);
        return RegistroExercicioResponse.success("Registro atualizado com sucesso!", toData(saved));
    }

    public RegistroExercicioResponse deleteRegistro(Long id) {
        if (!registroRepository.existsById(id)) {
            return RegistroExercicioResponse.error("Registro não encontrado.");
        }

        registroRepository.deleteById(id);
        return RegistroExercicioResponse.success("Registro excluído.", null);
    }

    public RegistroExercicioResponse getRegistrosHoje(Long exercicioId, Long userId) {
        LocalDate hoje = LocalDate.now();
        LocalDateTime inicio = hoje.atStartOfDay();
        LocalDateTime fim = hoje.atTime(LocalTime.MAX);

        List<RegistroExercicio> registros = registroRepository
                .findByExercicioIdAndUserIdAndCreatedAtBetweenOrderByNumeroSerieAsc(exercicioId, userId, inicio, fim);

        List<RegistroExercicioResponse.RegistroData> lista = registros.stream()
                .map(this::toData)
                .toList();

        return RegistroExercicioResponse.successList("Registros de hoje carregados.", lista);
    }

    public Map<String, List<RegistroExercicioResponse.RegistroData>> getHistorico(Long userId) {
        List<RegistroExercicio> registros = registroRepository.findByUserIdOrderByCreatedAtDesc(userId);

        return registros.stream()
                .map(this::toData)
                .collect(Collectors.groupingBy(
                        r -> r.getCreatedAt().toLocalDate().toString(),
                        LinkedHashMap::new,
                        Collectors.toList()));
    }

    private RegistroExercicioResponse.RegistroData toData(RegistroExercicio reg) {
        return new RegistroExercicioResponse.RegistroData(
                reg.getId(),
                reg.getExercicio().getId(),
                reg.getExercicio().getNome(),
                reg.getUserId(),
                reg.getCarga(),
                reg.getRepeticoes(),
                reg.getNumeroSerie(),
                reg.getCreatedAt());
    }
}
