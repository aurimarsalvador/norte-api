package br.com.norte.norte_api.student;

public record StudentResponse(
        Long id,
        String name,
        String email,
        Integer schoolYear
) {

    public static StudentResponse from(Student student) {
        return new StudentResponse(student.getId(), student.getName(), student.getEmail(),
                student.getSchoolYear());
    }
}
