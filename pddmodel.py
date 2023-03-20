import numpy as np
import pickle
import streamlit as st

load_model = pickle.load(open('D:/Minor Project/model1.pkl','rb'))

def run_model(input):
  newinp = np.array([input])
  pred = load_model.predict(newinp)
  # print(pred)
  if(pred[0]==0):
    return "You have no psychiatric disorder"
  elif(pred[0]==1):
    return "You might have mild psychiatric disorder"
  elif(pred[0]==2):
    return "You might have moderate psychiatric disorder. We advise you to consult a psychiatrist"
  else:
    return "You might have severe psychiatric disorder. We advise you to consult a psychiatrist immediately"

def main():
  st.title('Psychiatric Disorder Detection')
  result = ""
  st.write("***All questions are necessary !!")
  st.write(" '1' >> (Didn't apply to me at all)")
  st.write(" '2' >> (Applied to me to some degree)")
  st.write(" '3' >> (Applied to me to a considerable degree)")
  st.write(" '4' >> (Applied to me very much, or most of the time)")
  st.write("")
  st.write("Questions for detection of Psychological disorder (30):")
  st.write("")
  q1 = st.radio('Q1. I found myself getting upset by quite trivial things.', ['1', '2', '3', '4'])
  q2 = st.radio("Q2. I couldn't seem to experience any positive feeling at all.", ['1', '2', '3', '4'])
  q3 = st.radio('Q3. I experienced breathing difficulty in the absence of physical exertion.', ['1', '2', '3', '4'])
  q4 = st.radio("Q4. I just couldn't seem to get going.", ['1', '2', '3', '4'])
  q5 = st.radio('Q5. I had a feeling of shakiness', ['1', '2', '3', '4'])
  q6 = st.radio('Q6. I found it difficult to relax.', ['1', '2', '3', '4'])
  q7 = st.radio('Q7. I found myself in situations that made me so anxious I was most relieved when they ended.', ['1', '2', '3', '4'])
  q8 = st.radio('Q8. I felt that I had nothing to look forward to.', ['1', '2', '3', '4'])
  q9 = st.radio('Q9. I found myself getting upset rather easily.', ['1', '2', '3', '4'])
  q10 = st.radio('Q10. I felt that I was using a lot of nervous energy.', ['1', '2', '3', '4'])
  q11 = st.radio('Q11. I felt sad and depressed.', ['1', '2', '3', '4'])
  q12 = st.radio('Q12. I felt that I had lost interest in just about everything.', ['1', '2', '3', '4'])
  q13 = st.radio("Q13. I felt I wasn't worth much as a person.", ['1', '2', '3', '4'])
  q14 = st.radio('Q14. I felt scared without any good reason.', ['1', '2', '3', '4'])
  q15 = st.radio("Q15. I felt that life wasn't worthwhile.", ['1', '2', '3', '4'])
  q16 = st.radio('Q16. I found it hard to wind down.', ['1', '2', '3', '4'])
  q17 = st.radio("Q17. I couldn't seem to get any enjoyment out of the things I did.", ['1', '2', '3', '4'])
  q18 = st.radio('Q18. I felt down-hearted and blue.', ['1', '2', '3', '4'])
  q19 = st.radio('Q19. I found that I was very irritable.', ['1', '2', '3', '4'])
  q20 = st.radio('Q20. I felt I was close to panic.', ['1', '2', '3', '4'])
  q21 = st.radio('Q21. I found it hard to calm down after something upset me.', ['1', '2', '3', '4'])
  q22 = st.radio('Q22. I found it difficult to tolerate interruptions to what I was doing.', ['1', '2', '3', '4'])
  q23 = st.radio('Q23. I was in a state of nervous tension.', ['1', '2', '3', '4'])
  q24 = st.radio('Q24. I felt I was pretty worthless.', ['1', '2', '3', '4'])
  q25 = st.radio('Q25. I was intolerant of anything that kept me from getting on with what I was doing.', ['1', '2', '3', '4'])
  q26 = st.radio('Q26. I felt terrified.', ['1', '2', '3', '4'])
  q27 = st.radio('Q27. I felt that life was meaningless.', ['1', '2', '3', '4'])
  q28 = st.radio('Q28. I found myself getting agitated.(troubled or nervous)', ['1', '2', '3', '4'])
  q29 = st.radio('Q29. I was worried about situations in which I might panic and make a fool of myself.', ['1', '2', '3', '4'])
  q30 = st.radio('Q30. I experienced trembling (eg, in the hands).', ['1', '2', '3', '4'])
  st.write("")
  if st.button("TEST"):
    val = [q1,q2,q3,q4,q5,q6,q7,q8,q9,q10,q11,q12,q13,q14,q15,q16,q17,q18,q19,q20,q21,q22,q23,q24,q25,q26,q27,q28,q29,q30]
    result = run_model(val)
    st.success(result)

if __name__ == "__main__":
  main()

