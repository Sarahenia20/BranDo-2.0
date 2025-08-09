<?php
namespace App\Http\Controllers;

use App\Http\Requests\StoreSurveyAnswerRequest;
use App\Models\SurveyAnswer;
use App\Models\SurveyQuestionAnswer;
use Illuminate\Http\Request;

class SurveyAnswerController extends Controller
{
    public function store(StoreSurveyAnswerRequest $request)
    {
        $validated = $request->validated();

        foreach ($validated['answers'] as $answer) {
            SurveyQuestionAnswer::create([
                'survey_question_id' => $answer['survey_question_id'],
                'survey_answer_id' => $answer['survey_answer_id'] ?? null, // Adjust as necessary
                'answer' => $answer['answer'],
            ]);
        }

        return response()->json(['message' => 'Answers submitted successfully'], 201);
    }
}
