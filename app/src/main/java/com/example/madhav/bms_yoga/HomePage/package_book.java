package com.example.madhav.bms_yoga.HomePage;


import android.app.DatePickerDialog;
import android.content.SharedPreferences;
import android.os.AsyncTask;
import android.os.Bundle;
import android.support.v4.app.DialogFragment;
import android.support.v4.app.Fragment;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.DatePicker;
import android.widget.EditText;
import android.widget.ImageView;
import android.widget.ProgressBar;
import android.widget.Spinner;
import android.widget.TextView;
import android.widget.Toast;

import com.android.volley.Request;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.StringRequest;
import com.example.madhav.bms_yoga.R;
import com.example.madhav.bms_yoga.controller.VolleySingleton;
import com.example.madhav.bms_yoga.model.mSchedule;
import com.example.madhav.bms_yoga.network.mAPI;

import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.HashMap;
import java.util.Locale;
import java.util.Map;

import static android.content.Context.MODE_PRIVATE;

/**
 * A simple {@link Fragment} subclass.
 */
public class package_book extends DialogFragment {
    ImageView imageView_closeSchp;
    ProgressBar progB_bookp;
    Button btn_bookp;

    public package_book() {
        // Required empty public constructor
    }
    private TextView mpsd;
    private Spinner mpsc;
    private Spinner mpss;
    Calendar myCalendar = Calendar.getInstance();
    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        // Inflate the layout for this fragment
        View v =  inflater.inflate(R.layout.fragment_package_book, container, false);
        imageView_closeSchp = v.findViewById(R.id.imageView_closeSchp);
        progB_bookp = v.findViewById(R.id.progB_bookp);
        btn_bookp = v.findViewById(R.id.btn_bookp);
        mpsd = v.findViewById(R.id.input_name_datep);
        mpsc = v.findViewById(R.id.input_centrep);
        mpss = v.findViewById(R.id.input_slotp);
        progB_bookp.setVisibility(View.GONE);



        mpsd.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                DatePickerDialog dialog = new DatePickerDialog(getContext(), new DatePickerDialog.OnDateSetListener() {

                    @Override
                    public void onDateSet(DatePicker view, int year, int monthOfYear,
                                          int dayOfMonth) {
                        // TODO Auto-generated method stub
                        myCalendar.set(Calendar.YEAR, year);
                        myCalendar.set(Calendar.MONTH, monthOfYear);
                        myCalendar.set(Calendar.DAY_OF_MONTH, dayOfMonth);

                        updateLabel();
                    }
                }, myCalendar.get(Calendar.YEAR), myCalendar.get(Calendar.MONTH), myCalendar.get(Calendar.DAY_OF_MONTH));
                dialog.getDatePicker().setMinDate(System.currentTimeMillis());

                long now = System.currentTimeMillis() - 1000;
                dialog.getDatePicker().setMaxDate(now+(1000*60*60*24*7));
                dialog.show();
            }
        });
        imageView_closeSchp.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                getDialog().dismiss();
            }
        });
        btn_bookp.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                new LongOperationBookPackage().execute("");
            }
        });
        return v;
    }
    private void updateLabel() {
        String myFormat = "yyyy/MM/dd"; //In which you need put here
        SimpleDateFormat sdf = new SimpleDateFormat(myFormat, Locale.US);

        mpsd.setText(sdf.format(myCalendar.getTime()));
    }

    private void bookpack() {
        final mSchedule msch = new mSchedule(mpsd.getText().toString(),mpsc.getSelectedItem().toString(),mpss.getSelectedItem().toString());
        SharedPreferences prefs = this.getActivity().getSharedPreferences("email_pref",MODE_PRIVATE);
        String restoredText = prefs.getString("email", null);

        StringRequest postRequest = new StringRequest(Request.Method.POST, mAPI.PACKAGE_URL+restoredText,
                new Response.Listener<String>()
                {
                    @Override
                    public void onResponse(String response) {
                        // response
                        Log.d("Response", response);

                        Toast.makeText(getContext(), "Your package class is scheduled on "+mpsd.getText(),
                                Toast.LENGTH_LONG).show();
                        mpsd.setText("");
                        mpsc.setSelection( 0 );
                        mpss.setSelection( 0 );
                        mpsd.requestFocus();
                        getDialog().dismiss();
                    }
                },
                new Response.ErrorListener()
                {
                    @Override
                    public void onErrorResponse(VolleyError error) {
                        // error
                        Log.d("Error.Response", String.valueOf(error));
                        Toast.makeText(getContext(), "Empty fields",
                                Toast.LENGTH_LONG).show();
                    }
                }
        )
        {
            @Override
            protected Map<String, String> getParams()
            {
                Map<String, String>  params = new HashMap<String, String>();
                params.put("date", msch.getmSchDate());
                params.put("center", msch.getmSchCentre());
                params.put("slot", msch.getmSchSlot());
                return params;
            }
        };
        VolleySingleton.getInstance(getContext()).addToRequestQueue(postRequest);
    }

    private class  LongOperationBookPackage extends AsyncTask<String, Void, String> {


        @Override
        protected String doInBackground(String... params) {

            bookpack();
            for (int i = 0; i < 5; i++) {
                try {
                    Thread.sleep(1000);
                } catch (InterruptedException e) {
                    Thread.interrupted();
                }
            }


            return "Executed";
        }

        @Override
        protected void onPostExecute(String result) {
            //TextView txt = (TextView) findViewById(R.id.output);
            // txt.setText("Executed"); // txt.setText(result);
            progB_bookp.setVisibility(View.INVISIBLE);
            //Log.d("async", "executed");

            // might want to change "executed" for the returned string passed
            // into onPostExecute() but that is upto you
        }

        @Override
        protected void onPreExecute() {

            progB_bookp.setVisibility(View.VISIBLE);

        }

        @Override
        protected void onProgressUpdate(Void... values) {}
    }

}
